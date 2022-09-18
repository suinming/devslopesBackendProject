const path = require('path')
const Course = require('../models/Course.js')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc get all courses
// @route GET api/v1/courses
// @access PUBLIC
exports.getCourses = asyncHandler( async(req, res, next) => {
    res.status(200).json(res.filteredResults)
})

// @desc get single course
// @route GET api/v1/courses/:id
// @access PUBLIC
exports.getCourse = asyncHandler( async(req, res, next) => {

    const course = await Course.findById(req.params.id)

    if(!course){
      return next(new ErrorResponse(`course not found with id ${req.params.id}`, 404))
      // res.status(400).json({success:false})
    }

    res.status(200).json({success:true, data: course})
 
})

// @desc post a course
// @route POST api/v1/courses
// @access PRIVATE
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id

  const course = await Course.create(req.body)
  res.status(201).json({success:true, data:course})
})

// @desc update a course
// @route PUT api/v1/courses/:id
// @access PRIVATE
exports.updateCourse = asyncHandler(async(req, res, next) => {

  let course = await Course.findById(req.params.id) 

  if(!course){
    return next(new ErrorResponse(`course not found with id ${req.params.id}`, 404))
    // res.status(400).json({success: false})
  }

  if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User ${req.params.id} is not authorize to update this course`, 401))
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new:true,
    runValidators:true,
  })

  
  res.status(200).json({success:true, data:course })
 })

// @desc delete a course
// @route DELETE api/v1/courses/:id
// @access PRIVATE
exports.deleteCourse = asyncHandler(async(req, res, next) => {

  const course = await Course.findById(req.params.id) 

  if(!course){
    return next(new ErrorResponse(`course not found with id ${req.params.id}`, 404))
    // res.status(400).json({success:false})
  }

  if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User ${req.params.id} is not authorize to delete this course`, 401))
  }

  course.remove()

  res.status(200).json({success:true, data:{}})
})

// @desc upload a course photo
// @route PUT api/v1/courses/:id/photo
// @access PRIVATE
exports.courseUploadPhoto = asyncHandler(async(req, res, next) => {

  const course = await Course.findById(req.params.id) 
  if(!course){
    return next(new ErrorResponse(`course not found with id ${req.params.id}`, 404))
    // res.status(400).json({success:false})
  }

  if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User ${req.params.id} is not authorize to upload the photo`, 401))
  }

  const file = req.files.file
  
  // check if user upload a file
  if(!file){
    return next(new ErrorResponse(`please upload a file`, 400))
    // res.status(400).json({success:false})
  }

  // check if user upload a image 
  if(!file.mimetype.startsWith('image')){
    return next(new ErrorResponse(`please upload an image`, 400))
  }

  // check if user upload a image size greater than  
  if(file.size >= process.env.MAX_FILE_SIZE){
    return next(new ErrorResponse(`please upload an image less than ${process.env.MAX-FILE_SIZE }byte`, 400))
  }
  
  file.name = `photo_${course._id}${path.parse(file.name).ext}`
  
  // move the file to the target dir
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if(err){
      return next(new ErrorResponse(`problem with the file upload`, 500))
    }
    await Course.findByIdAndUpdate(req.params.id, {photo: file.name})
    res.status(200).send({success: true, data:file.name})
  })

})
