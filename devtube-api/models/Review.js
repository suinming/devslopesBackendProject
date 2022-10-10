const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'please add title'],
    trim: true,
    maxlength: [50, 'can not be more than 50 characters'],
  },
  text: {
    type: String,
    required: [true, 'please add description'],
    maxlength: [500, 'can not be more than 50 characters'],
  },
  rating: {
    type: Number,
    min:[1, 'rating must be at least 1'],
    max:[5, 'rating can not be more than 5'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  }
})

ReviewSchema.index({course: 1, user: 1}, {unique: true})

module.exports = mongoose.model('Review', ReviewSchema) 
