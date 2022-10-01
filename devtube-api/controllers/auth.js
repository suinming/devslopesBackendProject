const User = require('../models/User.js')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

// @desc register user 
// @route POST api/v1/auth/register
// @access PRIVATE
exports.register = asyncHandler( async(req, res, next) => {
  const {name, email, password, role} = req.body
  const user = await User.create({name, email, password, role})

  sendTokenResponse(user, 200, res)
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
  // console.log(user)


  if(!user){
    return next(new ErrorResponse('invalid credential', 401))
  }

  // important to await until the matchPassword function is executed
  const isMatch = await user.matchPassword(password)

  // console.log(isMatch)

  if(!isMatch){
    return next(new ErrorResponse('invalid password', 401))
  }
  
  sendTokenResponse(user, 200, res)

})

// @desc logout user 
// @route GET api/v1/auth/logout
// @access PRIVATE
exports.logout = asyncHandler( async (req, res, next) => {
  console.log(res)
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  })
  res.status(200).json({success: true, data:{}})
})

// @desc get logged in user 
// @route GET api/v1/auth/me
// @access PRIVATE
exports.getLoggedInUser = asyncHandler( async (req, res, next) => {
  // await is very important
  const user = await User.findById(req.user.id)
  res.status(200).json({success: true, data:user})
})

// @desc update user details 
// @route PUT api/v1/auth/updatedetails
// @access PRIVATE
exports.updateDetails = asyncHandler( async (req, res, next) => {
  const fieldToUpdate = {
    name: req.body.name,
    email: req.body.email,
  }
  const user = await User.findByIdAndUpdate(req.user.id, fieldToUpdate, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({success: true, data:user})
})

// @desc update user password 
// @route POST api/v1/auth/updatepassword
// @access PRIVATE
exports.updatePassword = asyncHandler( async (req, res, next) => {

  const user = await User.findById(req.user.id).select('+password')

  if(!(await user.matchPassword(req.body.currentPassword))){
    return next(new ErrorResponse('currentPassword is not current', 401))
  }

  user.password = req.body.newPassword
  await user.save()
  sendTokenResponse(user, 200, res)

})

// @desc forgot password 
// @route POST api/v1/auth/forgotpassword
// @access PRIVATE
exports.forgotpassword = asyncHandler( async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if(!user){
    return next(new ErrorResponse('there is no user for that email', 404))
  }

  const resetToken = user.getResetPasswordToken()

  await user.save({validateBeforeSave: false})

  const resetUrl =`${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}` 

  const message = `you are receiving this email because you has requested the email reset. Please make a PUT request to ${resetUrl}`

  console.log(user.email)

  const options = {
    email:user.email,
    subject:'password reset',
    message
  }

  try {
    await sendEmail(options)
    res.status(200).json({success:true, data:'email send'})
  } catch (error) {
    console.error(error)
    user.resetPasswordToken = undefined
    user.resetPasswordExpired =  undefined
    await user.save({validateBeforeSave: false})

    return next(new ErrorResponse('email can not be sent', 500))
  }

  res.status(200).json({success: true, data: user})
})

// @desc reset password 
// @route PUT api/v1/auth/resetpassword/:resettoken
// @access PRIVATE
exports.resetPassword = asyncHandler( async (req, res, next) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex')
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpired:{$gt: Date.now()},
  })

  if(!user){
    return next(new ErrorResponse('invalid token', 400))
  }
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpired = undefined
  await user.save()

  sendTokenResponse(user, 200, res)
})


const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwt()

  const options = {
    expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  }

  if(process.env.NODE_ENV === 'production'){
    options.secure = true
  }

  res.status(statusCode).cookie('token', token, options).json({success: true, token})

}
