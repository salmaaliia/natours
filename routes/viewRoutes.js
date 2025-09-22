const express = require('express');
const viewsController = require('./../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();
router.get('/me', authController.protect, viewsController.getAccount);
router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData,
);

router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverview);
// router.get('/tour', viewsController.getTour);
router.get('/tour/:slug', viewsController.getTour);
router.get('/login', viewsController.getLoginForm);
router.get('/signup', viewsController.getSignupForm);

module.exports = router;
