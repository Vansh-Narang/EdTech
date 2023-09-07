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
exports.getAverageRating = async (req, res) => {
    try {
        //course id (bcz course need rating)
        const courseId = req.body.courseId
        //calculate average rating
        const result = await RatingAndReview.aggregate(
            [{
                $match: {
                    //aaise entry jiski course id (courseId) se match krti ho
                    //chane course id to object id
                    course: new mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" }
                }
            }]
        )
        //return response
        if (result.length() > 0) {
            return response.status(200).json({
                success: true,
                //aggregate will return an array in result so to calculate average rating print avg rating like this
                averageRating: result[0].averageRating,
            })
        }
        //if not rating review exists
        return res.status(200).json({
            success: true,
            message: "Average rating is 0",
            averageRating: 0
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: "Couldn't get average rating",
            error: error
        })
    }
}

//get all rating and reviews not for specific course
exports.getAllRating = async (req, res) => {
    try {
        //get all rating and reviews
        const allReviews = await RatingAndReview.find({}).sort({ rating: "desc" })
            .populate({
                path: "user",
                //select only fields with lastname,email.......
                select: "firstName lastName email Image",
            }).populate({
                path: "course",
                select: "courseName"
            }).exec()

        return res.status(200).json({
            success: true,
            message: "All reviews are fetched successfully",
            data: allReviews
        })
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            success: false,
            message: "Error getting all reviews"
        })
    }
}

//get all rating and reviews for specific course
exports.getAllReviewsForCourse = async (req, res) => {
    try {
        //get course id
        const courseId = req.body
        //validation (check course exist or not)
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "No course found for this id"
            })
        }
        //get all rating and reviews and stored in database (if length > 0 means reviews are there else not)
        const allReviews = await RatingAndReview.findById({ _id: courseId }).populate({
            path: "user",
            //select only fields with lastname,email.......
            select: "firstName lastName email Image",
        }).populate({
            path: "course",
            select: "courseName"
        }).exec()

        if (allReviews.length <= 0) {
            return res.status(404).json({
                success: false,
                message: "No reviews found for this course"
            })
        }
        //return response
        res.status(200).json({
            success: true,
            message: "Rating and Reviews are fetched successfully for this courses"
        })

    } catch (error) {
        console.log(error)
        return res.status(404).json({
            success: false,
            message: "Error getting all reviews for this course"
        })
    }
}