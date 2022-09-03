const express = require('express')
const router = express.Router()

const {getStudents, getStudent, createStudent, updateStudent, deleteStudent, getClassesById} = require("../controllers/students.js")

router.route('/')
  .get(getStudents)
  .post(createStudent)

router.route('/:id')
  .get(getStudent)
  .put(updateStudent)
  .delete(deleteStudent)

module.exports = router
