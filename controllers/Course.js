const Course = require("../models/Course")
const Tag = require("../models/Tag")
const User = require("../models/User")

const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create and fetch
exports.createCourse = async (req, res) => {
    try {
        //if logged in , or not logged in
        //fetch the data

        //accepting the tag as an id
        const { courseName, courseDescription, whatYouWillLearn, price, tag } = req.body

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields"
            })
        }

        //check for instructor to store in the id
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details: " + instructorDetails)

        //if not data found
        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructors not found"
            })
        }

        //check tags are valid
        const tagDetails = await Tag.find(tag)
        if (!tagDetails) {
            return res.status(404).json({
                success: false,
                message: "Tags not found"
            })
        }

        //upload to cloudinary (thumbnail)

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, "Codehelper")

        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url
        })

        //add the new course to user schema
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            { new: true }
        )

        //update the tag schema

        return res.status(200).json({
            message: true,
            success: true,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        })
    }
}

//get all courses
exports.showAllCourses = async (req, res) => {
    try {

        //to do changes the below statemnets incrremently
        const allCourses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true
        })

        return res.status(200).json({
            success: true,
            message: "All courses found",
            data: allCourses
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: 'Cannot fetch all course'
        })
    }
}

//tags and course.js files are only be used by admin through the middleware
