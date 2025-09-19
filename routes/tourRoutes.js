const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes');

// create router
const router = express.Router();

// nested route
// POST /tour/31321231/reviwes
// GET /tour/31321231/reviwes
// GET /tour/31321231/reviwes/45fda478

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrectTO('user'),
//     reviewController.createReview,
//   );

router.use('/:tourId/reviews', reviewRouter);

// router.param('id', tourController.checkID);

// router.use(tourController.checkBody);

// Define routes

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStaus);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrectTO('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-within?233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrectTO('admin', 'lead-guide'),
    tourController.createTour,
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrectTO('admin', 'lead-guide'),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrectTO('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
