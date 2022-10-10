const Review = require('../models/Review.js')
const Course = require('../models/Course.js')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc get all reviews 
// @route GET api/v1/courses/:id/reviews
// @access PUBLIC 
exports.getReviews = asyncHandler( async(req, res, next) => {
  if(req.params.id){
    const reviews = await Review.find({course: req.params.id})
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    })
  } else{
    res.status(200).json(res.filteredResults)
  }

})

// @desc get single review 
// @route GET api/v1/reviews/:id
// @access PUBLIC 
exports.getReview = asyncHandler( async(req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "course",
    select: "name description"
  })

  if(!review){
    return next(new ErrorResponse(`no review found by id ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: review
  })

})

// @desc add review 
// @route POST api/v1/courses/:id/reviews
// @access PRIVATE 
exports.addReview = asyncHandler( async(req, res, next) => {
  req.body.course = req.params.id
  req.body.user = req.user.id

  const course = await Course.findById(req.params.id)

  if(!course){
    return next(new ErrorResponse(`no course found by id ${req.params.id}`, 404))
  }

  const review = await Review.create(req.body)

  res.status(200).json({
    success: true,
    data: review
  })

})

// @desc update review 
// @route PUT api/v1/reviews/:id
// @access PRIVATE 
exports.updateReview = asyncHandler( async(req, res, next) => {

  let review = await Review.findById(req.params.id)

  if(!review){
    return next(new ErrorResponse(`no review found by id ${req.params.id}`, 404))
  }

  if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`not authorize to update the review`, 401))
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: review
  })

})

// @desc delete review 
// @route DELETE api/v1/reviews/:id
// @access PRIVATE 
exports.deleteReview = asyncHandler( async(req, res, next) => {

  const review = await Review.findById(req.params.id)

  if(!review){
    return next(new ErrorResponse(`no review found by id ${req.params.id}`, 404))
  }

  if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`not authorize to update the review`, 401))
  }

  await review.remove()

  res.status(200).json({
    success: true,
    data: {} 
  })

})



