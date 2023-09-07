const express = require('express')
const router = express.Router();


const { sendOTP, signup, login, changePassword } = require("../controllers/Auth")


router.get("/sendOtp", sendOTP)
router.get("/signup", signup)
router.get("/changePassword", changePassword)
router.get("/login", login)

module.exports = router