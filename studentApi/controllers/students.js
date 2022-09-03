const Student = require('../models/Student') 

// utility function

// sort the obj by the last lastName
const sortByLastName = (students, order) => {
  console.log(students)

  const sortBy = "lastName"

  return students.sort((a,b) => {
        if (a[sortBy]< b[sortBy]) {
            return order === 'asc' ? -1 : 1;
        } else if (a[sortBy]> b[sortBy]) {
            return order === 'asc' ? 1 : -1;
        } else {
            return 0;
        }
  })
}

// @desc get all students 
// @route GET api/v1/students
// @access PUBLIC
exports.getStudents = async(req, res, next) => {
  try {
    const obj = req.query
    let students = await Student.find({})

    // if query has sort 
    if(obj.hasOwnProperty('sort')){
      students = await sortByLastName(students, obj.sort)
    }

    // if query has limit
    if(obj.hasOwnProperty('limit')){
      students = students.slice(0,obj.limit)
    }

    res.status(200).json({success:true, count:students.length, data: students})
    
  } catch (error) {
    console.error(error)
    res.status(400).json({success:false}) 
  }
}

// @desc get single student
// @route GET api/v1/students/:id
// @access PUBLIC 
exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)

    if(!student){
      res.status(400).json({success: false}) 
    }

    res.status(200).json({success: true, data:student})

  } catch (error) {
    res.status(400).json({success: false}) 
  }
}

// @desc post a student
// @route api/v1/students
// @access PRIVATE
exports.createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body)
    res.status(201).send({success: true, data: student})

  } catch (error) {
    console.error(error)
    res.status(400).send({success: false})
  }
}

// @desc update a student
// @route api/v1/students/:id
// @access PRIVATE
exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if(!student){
      res.status(400).send({success: false})
    }

    res.status(200).send({success: true, data: student})
    
  } catch (error) {
    console.error(error)
    res.status(400).send({success: false})
    
  }
}

// @desc delete student
// @route api/v1/students/:id
// @access PRIVATE
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id)

    if(!student){
      res.status(400).send({success: false})
    }

    res.status(200).send({success: true, data: student})
    
  } catch (error) {
    console.error(error)
    res.status(400).send({success: false})
  }
}

