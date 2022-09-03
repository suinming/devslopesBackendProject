const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const app = express()

// Parse the JSON
app.use(express.json())

const connectDB = require('./config/db.js')

dotenv.config({path:'./config/config.env'})
const PORT = process.env.PORT || 5000 

// make sure to execute the connectDB function after the env variables are setted
connectDB()

// routes filter
const students = require('./routes/students.js')

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use('/api/v1/students', students)

const server = app.listen(PORT, 
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

process.on('unhandledRejection', err => {
  console.log(`${err.message}`)
  server.close(() => process.exit(1))
})

