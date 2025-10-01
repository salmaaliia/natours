const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const { token } = require('morgan');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  // we're not saving to the database after setting user.password = undefined . We set it to undefined before sending the response to the client.
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });
  const url = `${req.protocol}://${req.get('host')}/me`;
  console.log(url);
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password exist
  if (!email || !password) {
    return next(new AppError('Youe must enter email and password', 400));
  }
  // 2) check if the user exist and the password is correct
  const user = await User.findOne({ email }).select('+password');
  const correct = await user?.correctPassword(password, user.password);

  if (!user || !correct) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything is okay send the token to the client
  createSendToken(user, 200, res);
  // const token = signToken(user._id);
});

exports.logout = (req, res) => {
  res.clearCookie('jwt');
  // res.cookie('jwt', '', {
  //   expires: new Date(Date.now() + 1 * 1000),
  //   httpOnly: true,
  // });

  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );
  }

  // 2) Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('THe user belong to this token no longer exist', 401),
    );
  }
  // 4) check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! please log in again.', 401),
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// Only for rendered pages, no errors
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    const token = req.cookies.jwt;
    // Verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next();
    }
    // check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }

    // There is a logged in user
    // inside all bug templates they can access user(will be a variable inside the template)
    res.locals.user = currentUser;
  }
  next();
});

exports.restrectTO = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('No user with this email address', 404));
  }

  // 2) Generate the random token
  const resetToken = user.createPasswordResetToken();
  // await User.save({ validateBeforeSave: false });
  await user.save({ validateModifiedOnly: true });

  // 3) send it to user`s email
  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpired = undefined;
    await user.save({ validateModifiedOnly: true });
    return next(
      new AppError(
        'There was an error sending the email, try again later!',
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpired: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is a user, set the new passowrd
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpired = undefined;
  await user.save({ validateModifiedOnly: true });

  // 3) update chnagedpasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, password, passwordConfirm } = req.body;
  // 1) Get the user from the collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) check if the POSTed password is correct
  const correct = await user?.correctPassword(oldPassword, user.password);

  if (!user || !correct) {
    return next(
      new AppError('The old password you provided is not correct', 401),
    );
  }

  // 3) If so, update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save({ validateModifiedOnly: true });

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
