const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

// load env var
dotenv.config({path: './config/config.env'})

// load models
const Course = require('./models/Course')
const User = require('./models/User')

// connect to db
const connect = mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// read json
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'))

// import into db
const importData = async () => {
  try {
    await Course.create(courses)
    await User.create(users)
    console.log('data imported')
    process.exit()
    
  } catch (error) {
    console.error(error)
  }
}

// delete date from db
const deleteData = async () => {
  try {
    await Course.deleteMany()
    await User.deleteMany()
    console.log('data deleted')
    process.exit()
    
  } catch (error) {
    console.error(error)
  }
}

if(process.argv[2] === '-i'){
  importData()
}else if(process.argv[2] === '-d'){
  deleteData()
}

