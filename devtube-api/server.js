const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const app = express()
const errorHandler = require('./middleware/error')
const fileUpload = require('express-fileupload')
const morgan = require('morgan')
const connectDB = require('./config/db.js')
const cookieParser = require('cookie-parser')

// set the env variables
dotenv.config({path:'./config/config.env'})
const PORT = process.env.PORT || 5000 

// make sure to execute the connectDB function after the env variables are setted
connectDB()

// routes files
const courses = require('./routes/courses.js')
const auth = require('./routes/auth.js')

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Parse the JSON
app.use(express.json())

app.use(cookieParser())

app.use(fileUpload())

app.use(express.static(path.join(__dirname, 'public')))

// mounted the router
app.use('/api/v1/courses', courses)

app.use('/api/v1/auth', auth)

// error handle
app.use(errorHandler)

const server = app.listen(PORT, 
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

process.on('unhandledRejection', err => {
  console.log(`${err.message}`)
  server.close(() => process.exit(1))
})

