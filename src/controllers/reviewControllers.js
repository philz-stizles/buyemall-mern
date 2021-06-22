const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');

// USING HANDLER FACTORY
exports.createReview = factory.createOne(Review)
exports.getAllReviews = factory.getAll(Review)
exports.getReview = factory.getOne(Review)
exports.updateReview = factory.updateOne(Review)
exports.deleteReview = factory.deleteOne(Review)