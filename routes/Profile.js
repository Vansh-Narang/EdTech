const express = require('express')
const router = express.Router()
const { auth } = require("../middlewares/auth")

const { updateProfile, deleteAccount, getUserDetails } = require("../controllers/Profile")

router.post("/updateProfile", updateProfile)
router.post("/deleteAccount", deleteAccount)
router.post("/getUserDetails", getUserDetails)

