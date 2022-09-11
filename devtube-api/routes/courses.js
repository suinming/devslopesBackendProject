const express = require('express')
const router = express.Router()
const filteredResults = require('../middleware/filteredResults')
const Course = require('../models/Course')

const {getCourses, getCourse, createCourse, updateCourse, deleteCourse, courseUploadPhoto} = require("../controllers/courses.js")

router.route('/')
  .get(filteredResults(Course), getCourses)
  .post(createCourse)

router.route('/:id')
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse)

router.route('/:id/photo')
  .put(courseUploadPhoto)

// router.get('/', (req, res) => {
//   res.status(200).json({success:true, msg:'get all courses'})
// })
//
// router.get('/:id', (req, res) => {
//   res.status(200).json({success:true, msg:`get single course by id ${req.params.id}` })
// })
//
// router.post('/', (req, res) => {
//   res.status(200).json({success:true, msg:'create new courses'})
// })
//
// router.put('/:id', (req, res) => {
//   res.status(200).json({success:true, msg:`update single course by id ${req.params.id}` })
// })
//
// router.delete('/:id', (req, res) => {
//   res.status(200).json({success:true, msg:`delete single course by id ${req.params.id}`})
// })
//
module.exports = router
