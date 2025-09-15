const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');

const filterObj = (obj, allowedFields) => {
  const resObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) resObj[el] = obj[el];
  });
  return resObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .fieldLimitting()
    .pagination();

  const users = await features.query;

  res.status(200).json({
    status: 'success',
    results: users.length,
    users: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const user = req.user;
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'You cannot update password here. Please use /updatePassword',
        400,
      ),
    );
  }

  // 2) Update user document
  const allowedFieldsObj = filterObj(req.body, ['name', 'email']);
  const updatedUser = await User.findByIdAndUpdate(user.id, allowedFieldsObj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteME = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined ',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined ',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined ',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined ',
  });
};
