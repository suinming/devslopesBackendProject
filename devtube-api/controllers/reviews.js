const Review = require('../models/Review.js')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc get all reviews 
// @route GET api/v1/reviews
// @access PUBLIC 
exports.getReviews = asyncHandler( async(req, res, next) => {
  res.status(200).json(res.filteredResults)
})
