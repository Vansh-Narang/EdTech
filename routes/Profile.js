const express = require('express')
const router = express.Router()
const { auth } = require("../middlewares/auth")

const { updateProfile, deleteProfile, getUserDetails, getEnrolledCourses, updateDisplayPicture } = require("../controllers/Profile")

router.put("/updateProfile", auth, updateProfile)
router.delete("/deleteProfile", auth, deleteProfile)
router.get("/getUserDetails", auth, getUserDetails)

//get enrolled courses

//auth is passed as the middlewares to check the authorization has the access to change or update the things written below
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
//put is use to update the display picture
router.put("/updateDisplayPicture", auth, updateDisplayPicture)


module.exports = router