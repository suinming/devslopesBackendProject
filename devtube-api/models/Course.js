const mongoose = require('mongoose')
const slugify = require('slugify')

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'please add title'],
    trim: true,
    unique: true,
    maxlength: [50, 'can not be more than 50 characters'],
  },
  description: {
    type: String,
    required: [true, 'please add description'],
    maxlength: [500, 'can not be more than 50 characters'],
  },
  website: {
    type: String,
    match: [
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
      'please enter the valid url'
    ]
  },
  slug: String,
  modules: Number,
  price: Number,
  minimumSkill: {
    type: String,
    required: [true, 'please add the skill level'],
  },
  category: {
    type: String,
    required: [true, 'please enter the category'],
  },
  rating: {
    type: Number,
    min:[1, 'rating must be at least 1'],
    max:[5, 'rating can not be more than 5'],
  },
  photo: {
    type: String,
    default:'no-photo.jpeg',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

// before save the data into the database add the field slug of the title
CourseSchema.pre('save', function(next){
  this.slug = slugify(this.title, {lower: true})
  next()
})

module.exports = mongoose.model('Course', CourseSchema) 
