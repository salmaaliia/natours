const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

// POST /tour/31321231/reviwes
// GET /tour/31321231/reviwes
// GET /tour/31321231/reviwes/45fda478

router.use(authController.protect);

router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.restrectTO('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrectTO('user', 'admin'),
    reviewController.updateReview,
  )
  .delete(
    authController.restrectTO('user', 'admin'),
    reviewController.deleteReview,
  );

module.exports = router;
