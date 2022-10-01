const User = require('../models/User.js')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const jwt = require('jsonwebtoken')

exports.protect = async(req, res, next) => {
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1] // index 0 is Bearer ,index 1 is the token
  } 
  // else if(req.cookies.token){
  //   token = req.cookies.token
  // }

  if(!token){
    return next(new ErrorResponse('not authorization to access this route', 401))
  } 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded)
    req.user = await User.findById(decoded.id)
    next()
  } catch (error) {
    return next(new ErrorResponse('not authorization to access this route', 401))
  }

}

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)){
      return next(new ErrorResponse(`user role ${req.user.role} is not authorize to this route`, 403))
    }
    next()
  }

}


