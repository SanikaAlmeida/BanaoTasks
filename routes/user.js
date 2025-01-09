const {register,log,reqResetPassword,resetPassword}= require('../controller/user')
const express = require('express')
const router = express.Router()

router.post('/signup',register)
router.post('/login',log)
router.post('/reqReset',reqResetPassword)
router.post('/reset',resetPassword)

module.exports = router