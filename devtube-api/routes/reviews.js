const express = require('express')
const router = express.Router()
const filteredResults = require('../middleware/filteredResults')
const Review = require('../models/Review')

const {getReviews} = require("../controllers/reviews.js")

router.route('/')
  .get(filteredResults(Review), getReviews)


module.exports = router

