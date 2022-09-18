const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
  "name": {
    type: String,
    require:[true, 'please enter the name']
  },
  "email": {
    type: String, 
    require:[true, 'please add the email'],
    unique: true,
    match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'please add a valid email'],
  },
  "role": {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user',
  },
  "password": {
    type: String,
    require:[true, 'please add a password'],
    minlength: 6,
    select: false, // select is the mongo "projection" which will restrict the return field
  },
  "resetPasswordToken": String,
  "resetPasswordExpired": Date,
  "createdAt":{
    type: Date,
    default: Date.now,
  },
})

// before saveing into the database hash the password
UserSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// jwt
UserSchema.methods.getSignedJwt = function(){
  return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })

}

// compare password
UserSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password) 
}

UserSchema.methods.getResetPasswordToken = function(){
  const resetToken = crypto.randomBytes(20).toString('hex')
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  this.resetPasswordExpired = Date.now() + 10 * 60 * 1000
  return resetToken
} 

module.exports = mongoose.model('User', UserSchema) 
