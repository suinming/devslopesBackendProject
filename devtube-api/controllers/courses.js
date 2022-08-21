// @desc get all courses
// @route GET api/v1/courses
// @access PUBLIC
exports.getCourses = (req, res, next) => {
  res.status(200).json({success:true, msg:'get all courses'})
}

// @desc get single course
// @route GET api/v1/courses/:id
// @access PUBLIC
exports.getCourse = (req, res, next) => {
  res.status(200).json({success:true, msg:`get single course by id ${req.params.id}` })
}

// @desc post a course
// @route POST api/v1/courses
// @access PRIVATE
exports.createCourse = (req, res, next) => {
  res.status(200).json({success:true, msg:'create new courses'})
}

// @desc update a course
// @route POST api/v1/courses/:id
// @access PRIVATE
exports.updateCourse = (req, res, next) => {
  res.status(200).json({success:true, msg:`update single course by id ${req.params.id}` })
}

// @desc delete a course
// @route DELETE api/v1/courses/:id
// @access PRIVATE
exports.deleteCourse = (req, res, next) => {
  res.status(200).json({success:true, msg:`delete single course by id ${req.params.id}`})
}
