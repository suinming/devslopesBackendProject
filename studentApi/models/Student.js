const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
  firstName:{
    type:String,
    required: [true, 'please add first name'],
  },  
  lastName:{
    type:String,
    required: [true, 'please add last name'],
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  updatedOn: {
    type: Date,
    default: Date.now,
  },
  grade: {
    type:Number,
    min:[1, 'rating must be at least 1'],
    max:[5, 'rating can not be more than 5'],
  },
  class: {
    type:[String],
    default:[],
  },
})

module.exports = mongoose.model('Student', StudentSchema) 
