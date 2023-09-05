const { instance } = require("../config/razorpay")
const Course = require("../models/Course")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
// const {courseEnrollment}=


//capture the payment and intiate the razorpay payment
exports.capturePayment = async (req, res) => {
    try {
        //course kon buy kr rha hai aur user ki id bhi
        const { courseId } = req.body
        const userId = req.user.id
        //validation
        if (!courseId || !userId) {
            return res.json({
                success: false,
                message: "Please enter valid id's"
            })
        }
        //valid course id (details)

        let course;
        try {
            //finding the course
            course = await Course.findById(courseId)
            if (!course) {
                return res.json({
                    success: false,
                    message: "Course details not find"
                })
            }
            //user already paid

            //convert user id to object id
            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({
                    success: false,
                    message: "Student has already enrolled"
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: error
            })
        }
        //create the order 
        const amount = course.price;
        const currency = "INR";

        const options = {
            amount: amount * 100,
            currency: currency,
            recipt: Math.random(Date.now()).toString(),
            notes: {
                courseId: course._id,
                userId,
            }
        }

        try {
            //create the order(intiate the payment)
            const paymentResponse = await instance.orders.create(options)
            console.log(paymentResponse)
            //return the response
            return res.status(200).json({
                message: error,
                success: true,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                thumbnail: course.thumbnail,
                orderId: paymentResponse.orderId,
                currency: paymentResponse.currency,
                amount: paymentResponse.amount
            })

        } catch (error) {
            console.log(error)
            res.json({
                success: false,
                message: "Couldnot processed the payment"
            })
        }
    } catch (error) {

    }
}