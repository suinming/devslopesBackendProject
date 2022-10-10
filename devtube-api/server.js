const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const app = express()
const errorHandler = require('./middleware/error')
const fileUpload = require('express-fileupload')
const morgan = require('morgan')
const connectDB = require('./config/db.js')
const cookieParser = require('cookie-parser')

// security purpose npm package
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')

// set the env variables
dotenv.config({path:'./config/config.env'})
const PORT = process.env.PORT || 5000 

// make sure to execute the connectDB function after the env variables are setted
connectDB()

// routes files
const courses = require('./routes/courses.js')
const auth = require('./routes/auth.js')
const users = require('./routes/users.js')
const reviews = require('./routes/reviews.js')

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Parse the JSON
app.use(express.json())

app.use(cookieParser())

app.use(fileUpload())

app.use(mongoSanitize()); // use the mongo sanitize
app.use(helmet()); // use the helmet 
app.use(xss()); // use the xss clean 
app.use(hpp()) // use the hpp
app.use(cors()); // use the cors  

// set the rate limit obj
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
})

app.use(limiter) // use the rate limit 

app.use(express.static(path.join(__dirname, 'public')))

// mounted the router
app.use('/api/v1/courses', courses)

app.use('/api/v1/auth', auth)

app.use('/api/v1/users', users)

app.use('/api/v1/reviews', reviews)

// error handle
app.use(errorHandler)

const server = app.listen(PORT, 
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

process.on('unhandledRejection', err => {
  console.log(`${err.message}`)
  server.close(() => process.exit(1))
})

