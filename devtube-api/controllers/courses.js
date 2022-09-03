const Course = require('../models/Course.js')

// @desc get all courses
// @route GET api/v1/courses
// @access PUBLIC
exports.getCourses = async(req, res, next) => {
  try {
    const courses = await Course.find({})
    res.status(200).json({success:true, count:courses.length, data: courses})
    
  } catch (error) {
    res.status(400).json({success:false}) 
  }
}

// @desc get single course
// @route GET api/v1/courses/:id
// @access PUBLIC
exports.getCourse = async(req, res, next) => {

  try {
    const course = await Course.findById(req.params.id)

    if(!course){
      res.status(400).json({success:false})
    }

    res.status(200).json({success:true, data: course})
   
  } catch (error) {
    res.status(400).json({success:false})
  }
}

// @desc post a course
// @route POST api/v1/courses
// @access PRIVATE
exports.createCourse = async (req, res, next) => {
  console.log(req.body)
  try {
    const course = await Course.create(req.body)
    res.status(201).json({success:true, date:course})

  } catch (error) {

    res.status(400).json({success:false}) 
  }
}

// @desc update a course
// @route POST api/v1/courses/:id
// @access PRIVATE
exports.updateCourse = async(req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }) 

    if(!course){
      res.status(400).json({success: false})
    }
    res.status(200).json({success:true, data:course })

  } catch (error) {
    res.status(400).json({success: false})
  }
}

// @desc delete a course
// @route DELETE api/v1/courses/:id
// @access PRIVATE
exports.deleteCourse = async(req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id) 
    if(!course){
      res.status(400).json({success:false})
    }
    res.status(200).json({success:true, data:{}})
  } catch (error) {
    res.status(400).json({success:false})
  }
}
