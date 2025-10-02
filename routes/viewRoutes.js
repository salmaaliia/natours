const express = require('express');
const viewsController = require('./../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

router.get('/me', authController.protect, viewsController.getAccount);
router.get(
  '/my-tours',
  // bookingController.createBookingCheckout,
  authController.protect,
  viewsController.getMyTours,
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData,
);

router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverview);
router.get('/tour/:slug', viewsController.getTour);
router.get('/login', viewsController.getLoginForm);
router.get('/signup', viewsController.getSignupForm);

module.exports = router;
