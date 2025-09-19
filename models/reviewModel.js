const mongoose = require('mongoose');
const Tour = require('./tourModel');

// review / rating / createdAt /ref to tour / ref to user

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      // required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating cannot be empty'],
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a User'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  // .populate({
  //   path: 'tour',
  // });
  next();
});

// static methods
reviewSchema.statics.calcAverageRating = async function (tourId) {
  // this points to the model
  const stats = await this.aggregate([
    {
      // reviews that have tourId
      $match: { tour: tourId },
    },
    {
      // groub by
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.post('save', function () {
  // this points to current review (doc)
  // this.constructor -> Review
  this.constructor.calcAverageRating(this.tour);
});

// // findByIdAbdUpdate
// // findByIdAbdDelete
// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   // this points to the current query
//   // we can excute the query and then it is going to give us the document that 's currently being processed
//   this.r = await this.clone().findOne();
//   next();
// });
// reviewSchema.post(/^findOneAnd/, async function () {
//   await this.r.constructor.calcAverageRating(this.r.tour);
// });
// instead we can do

reviewSchema.post(/^findOneAnd/, async function (doc) {
  await doc.constructor.calcAverageRating(doc.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
