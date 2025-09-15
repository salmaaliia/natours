const express = require('express');
const userController = require('../controllers/userController');
const autController = require('../controllers/authController');
// create router
const router = express.Router();

// Define routes

router.post('/signup', autController.signup);
router.post('/login', autController.login);

router.post('/forgotPassword', autController.forgotPassword);
router.patch('/resetPassword/:token', autController.resetPassword);
router.patch(
  '/updatePassword',
  autController.protect,
  autController.updatePassword,
);
// router.patch('/updateMe', autController.protect, userController.updateMe);
// router.delete('/deleteMe', autController.protect, userController.deleteME);

router.patch('/me', autController.protect, userController.updateMe);
router.delete('/me', autController.protect, userController.deleteME);

// For admain
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
