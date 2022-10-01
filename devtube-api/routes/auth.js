const express = require('express')
const router = express.Router()
const {register, login, getLoggedInUser , logout, forgotpassword, resetPassword, updateDetails, updatePassword} = require('../controllers/auth')
const {protect} = require('../middleware/auth.js')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/forgotpassword').post(forgotpassword)
router.route('/me').get(protect, getLoggedInUser)
router.route('/resetpassword/:resettoken').put(resetPassword)
router.route('/updatedetails').put(protect, updateDetails)
router.route('/updatepassword').post(protect, updatePassword)

module.exports = router
