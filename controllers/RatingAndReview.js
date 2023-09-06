const RatingAndReview = require("../models/RatingAndReview")
const Course = require("../models/Course")

//create review and rating
exports.createRating = async (req, res) => {
    try {
        //get userid
        const userId = req.user.id
        //fetch data from req body
        const { rating, review, courseId } = req.body
        //check if user is enrolled or not
        const courseDetails = await Course.findOne({
            _id: courseId,
            //use element match operator to see whether user is already enrolled there or not
            studentsEnrolled: { $elemMatch: { $eq: userId } }
        })

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Students not enrolled in ratings"
            })
        }
        //one time one review
        const alreadyReview = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        })
        if (alreadyReview) {
            return res.status(400).json({
                success: false,
                message: 'Review already',
            })
        }
        //create rating and review
        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId
        })
        //update course with rating and review
        const updatedDetails = await Course.findOneAndUpdate({ _id: courseId },
            {
                $push: {
                    ratingAndReviews: ratingReview._id,
                },
            },
            {
                new: true
            })
        console.log(updatedDetails)
        //return response
        res.status(200).json({
            updatedDetails,
            success: true,
            message: "Course updated successfully with rating and review"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error creating rating and review",
        })
    }
}
//create average rating


//get all rating and reviews