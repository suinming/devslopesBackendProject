const User = require('../models/User.js')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc get all users 
// @route GET api/v1/auth/users
// @access PRIVATE
exports.getUsers = asyncHandler( async(req, res, next) => {
  res.status(200).json(res.filteredResults)
})

// @desc get single user 
// @route GET api/v1/users/:id
// @access PRIVATE/ADMIN
exports.getUser = asyncHandler( async(req, res, next) => {
  const user = await User.findById((req.params.id))

  if(!user){
    return next(ErrorResponse('user not found', 404))
  }
  res.status(200).json({
    success: true,
    data: user
  })
})

// @desc create user 
// @route POST api/v1/users
// @access PRIVATE/ADMIN
exports.createUser = asyncHandler( async(req, res, next) => {
  const user = await User.create(req.body)

  res.status(200).json({
    success: true,
    data: user
  })
})

// @desc update user 
// @route PUT api/v1/users/:id
// @access PRIVATE/ADMIN
exports.updateUser = asyncHandler( async(req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if(!user){
    return next(ErrorResponse('user not found', 404))
  }

  res.status(200).json({
    success: true,
    data: user
  })
})

// @desc delete user 
// @route DELETE api/v1/users/:id
// @access PRIVATE/ADMIN
exports.deleteUser = asyncHandler( async(req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id)

  if(!user){
    return next(ErrorResponse('user not found', 404))
  }

  res.status(200).json({
    success: true,
    data: {} 
  })
})

