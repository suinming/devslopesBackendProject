const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

// load env var
dotenv.config({path: './config/config.env'})

// load models
const Course = require('./models/Course')

// connect to db
const connect = mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// read json
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'))

// import into db
const importData = async () => {
  try {
    await Course.create(courses)
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

