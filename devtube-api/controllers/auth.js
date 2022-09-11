const User = require('../models/User.js')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc register user 
// @route POST api/v1/auth/register
// @access PRIVATE
exports.register = asyncHandler( async(req, res, next) => {
  const {name, email, password, role} = req.body
  const user = await User.create({name, email, password, role})

  const token = user.getSignedJwt()
  res.status(200).json({success: true, token: token})
})

// @desc login user 
// @route POST api/v1/auth/login
// @access PRIVATE
exports.login = asyncHandler( async(req, res, next) => {
  const {email, password} = req.body

  if(!email || !password){
    return next(new ErrorResponse('please enter the email and password', 404))
  }

  const user = await User.findOne({email}).select('+password') // not fully understand
  console.log(user)


  if(!user){
    return next(new ErrorResponse('invalid credential', 401))
  }

  const isMatch = user.matchPassword(password)

  if(!isMatch){
    return next(new ErrorResponse('invalid password', 401))
  }
  
  const token = user.getSignedJwt()
  res.status(200).json({success: true, token: token})
})
