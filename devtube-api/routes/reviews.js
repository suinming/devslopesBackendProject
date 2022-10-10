const express = require('express')
const router = express.Router({mergeParams: true}) // some trick
const filteredResults = require('../middleware/filteredResults')
const {protect, authorize} = require('../middleware/auth.js')

const Review = require('../models/Review')

const {getReviews, getReview, addReview, updateReview, deleteReview} = require("../controllers/reviews.js")

router.route('/')
  .get(filteredResults(Review), getReviews)
  .post(protect, authorize('user', 'admin'), addReview)

router.route('/:id')
  .get(getReview)
  .put(protect, authorize('admin'), updateReview)
  .delete(protect, authorize('admin'), deleteReview)

module.exports = router

