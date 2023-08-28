const Course = require("../models/Course")
const Tag = require("../models/Tag")
const User = require("../models/User")

const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create and fetch
exports.createCourse = async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        })
    }
}

//get all courses


//tags and course .js files are only be used by admin through the middleware
