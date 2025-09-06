const express = require('express');
const tourController = require('../controllers/tourController');
// create router
const router = express.Router();

router.param('id', tourController.checkID);

// router.use(tourController.checkBody);

// Define routes
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
