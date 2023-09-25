const Course = require("../models/Course")
//course is the schema / model
const Category = require("../models/Category")
//tag is the schema / model
const User = require("../models/User")
//user is the schema / model
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create and fetch
exports.createCourse = async (req, res) => {
    try {
        //if logged in , or not logged in
        //fetch the data

        //accepting the tag as an id
        const { courseName, courseDescription, whatYouWillLearn, price, category } = req.body

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !category) {
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
        const categoryDetails = await Category.findById(category)
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Tags not found"
            })
        }

        //upload to cloudinary (thumbnail)

        // const thumbnailImage = await uploadImageToCloudinary(thumbnail, "Codehelper")

        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            category: categoryDetails._id,
            // thumbnail: thumbnailImage.secure_url
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
            message: "created the course successfully",
            success: true,
        })
    } catch (error) {
        res.status(500).json({

            success: false,
            message: error.message
        })
    }
}//testing done but image upload left

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
}//testing done

//tags and course.js files are only be used by admin through the middleware

//course entire details to be returned make a controller for the same
exports.getCourseDetails = async (req, res) => {
    try {
        //get the course id
        const { courseId } = req.body;
        //validate
        if (!courseId) {
            return res.status(403).json({
                success: false,
                message: "Course id not found"
            })
        }
        //find and populate because we will get the object id
        const courseDetails = await Course.find(
            { _id: courseId }).populate({
                path: "instrutor",
                //instructor ko popluate fir uske aander addittional Details usse bhi populate
                populate: {
                    path: "additionalDetails"
                }
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            })
            .exec();
        //return response
        if (!courseDetails) {
            return res.status(400).json({
                success: true,
                message: "Course details couldnot be fetched"
            })
        }
        res.status(200).json({
            success: true,
            message: "Success fetched data"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error fetching course all data"
        })
    }
}