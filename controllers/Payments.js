const { RiTaxiFill } = require("react-icons/ri")
const { instance } = require("../config/razorpay")
const Course = require("../models/Course")
const crypto = require("crypto")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const { default: mongoose } = require("mongoose");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollment")
const { paymentSuccessEmail } = require("../mail/templates/paymentConfirm")
const { courseProgress } = require("../models/CourseProgress")
const { default: toast } = require("react-hot-toast")
// const {courseEnrollment}=


// //capture the payment and intiate the razorpay payment
// exports.capturePayment = async (req, res) => {
//     try {
//         //course kon buy kr rha hai aur user ki id bhi
//         const { courseId } = req.body
//         const userId = req.user.id
//         //validation
//         if (!courseId || !userId) {
//             return res.json({
//                 success: false,
//                 message: "Please enter valid id's"
//             })
//         }
//         //valid course id (details)

//         let course;
//         try {
//             //finding the course
//             course = await Course.findById(courseId)
//             if (!course) {
//                 return res.json({
//                     success: false,
//                     message: "Course details not find"
//                 })
//             }
//             //user already paid

//             //convert user id to object id
//             const uid = new mongoose.Types.ObjectId(userId);
//             if (course.studentsEnrolled.includes(uid)) {
//                 return res.status(200).json({
//                     success: false,
//                     message: "Student has already enrolled"
//                 })
//             }
//         } catch (error) {
//             console.log(error)
//             return res.status(500).json({
//                 success: false,
//                 message: error
//             })
//         }
//         //create the order
//         const amount = course.price;
//         const currency = "INR";

//         const options = {
//             amount: amount * 100,
//             currency: currency,
//             recipt: Math.random(Date.now()).toString(),
//             notes: {
//                 courseId: course._id,
//                 userId,
//             }
//         }

//         try {
//             //create the order(intiate the payment)
//             const paymentResponse = await instance.orders.create(options)
//             console.log(paymentResponse)
//             //return the response
//             return res.status(200).json({
//                 message: error,
//                 success: true,
//                 courseName: course.courseName,
//                 courseDescription: course.courseDescription,
//                 thumbnail: course.thumbnail,
//                 orderId: paymentResponse.orderId,
//                 currency: paymentResponse.currency,
//                 amount: paymentResponse.amount
//             })

//         } catch (error) {
//             console.log(error)
//             res.json({
//                 success: false,
//                 message: "Couldnot process the payment"
//             })
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             success: false,
//             message: "Could not process the payment"
//         })
//     }
// }
// //verify the signature of razorpay and the backend
// exports.verifySignature = async (req, res) => {
//     //we have send a signature when the payment started in the encrypted formate and when the payment is done for authorzation we have to check in the end
//     try {
//         const webHookSecret = "12345678";

//         //syntax
//         const signature = req.headers("x-razorpay-signature")

//         //razorpay has send the signature in the hashed form so hashing must be done to
//         //check

//         //hashed

//         //digest is the ouptut of using the hashed algorithm
//         const shahsum = crypto.createHmac("sha256", webHookSecret)
//         shahsum.update(JSON.stringify(req.body))
//         //sha hashing is the hasing function
//         const digest = shahsum.digest("hex")
//         //hex is hexadecimal

//         //match signature with shahsum
//         if (signature === digest) {
//             console.log("payment is authorized")

//             //enroll in course

//             //map two methods
//             //1)--------User->map->course->objectID
//             //2)--------Course->studentsEnrolled->userID

//             //call is coming from the razorpay not from the front end so no data we can have in our body from req.body
//             //as we have send the data from the notes , so we can accept it from there the {course id and userid}

//             const { courseId, userId } = req.body.payload.payment.entity.notes;

//             try {
//                 //fulfill the action
//                 //find the course enroll the students in it
//                 const enrollCourse = await Course.find({ _id: courseId },
//                     { $push: { studentsEnrolled: userId }, },
//                     { new: true })

//                 if (!enrollCourse) {
//                     return res.status(500).json({
//                         success: false,
//                         message: "Could not enroll in the course"
//                     })
//                 }
//                 console.log(enrollCourse)

//                 //find the students to course to thier list
//                 const enrolledStudent = await User.findOneAndUpdate({ _id: userId },
//                     {
//                         $push: {
//                             courses: courseId
//                         }
//                     },
//                     { new: true })

//                 if (!enrolledStudent) {
//                     return res.json({
//                         success: false,
//                         message: "Students cannot be updated"
//                     })
//                 }
//                 console.log(enrolledStudent)
//                 //send email

//                 //mail,title,body
//                 const mailResponse = await mailSender(enrolledStudent.email, "Congratulations!", "Again congratulations")


//                 console.log(mailResponse)
//                 return res.status(200).json({
//                     success: true,
//                     message: "done with mail sending and enrollment"
//                 })
//             } catch (error) {
//                 console.log(error)
//                 return res.status(500).json({
//                     success: false,
//                     message: error.message
//                 })
//             }
//         }
//         else {
//             return res.status(400).json({
//                 success: false,
//                 message: "Couldnot match the signature"
//             })
//         }

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Could not verify the signature"
//         })
//     }
// }

exports.capturePayment = async (req, res) => {
    //steps

    //pehle courses liya jisko buy karna hai
    const { courses } = req.body;
    //fir user ki id li jisko buy karna hai
    const userId = req.user.id;

    //courses show ho rhe hai saare ya nahi
    if (courses.length === 0) {
        return res.json({
            success: false,
            message: "Please enter all courses id"
        })
    }

    //total amount nikala courses ka jo buy karne hai
    let totalAmount = 0;

    for (const course_id of courses) {
        let course;
        try {
            //saare course ka data mil jayega course ki id se
            course = await Course.findById(course_id);
            if (!course) {
                return res.status(400).json({
                    success: false,
                    message: "Course not found"
                })
            }

            //student pehle to enroll nahi hai course me
            const uid = new mongoose.Types.ObjectId(userId)
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({
                    success: false,
                    message: "Student is already enrolled"
                })
            }
            //calculate the total amount
            totalAmount += course.price
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                success: false,
                error: `Couldnot capture payment ${error.message}`
            })
        }
    }
    //create options the necessary syntax
    const currency = "INR";
    const options = {
        amount: totalAmount * 100,
        currency,
        receipt: Math.random(Date.now()).toString()
    }

    //payment response (orders create as an instance)
    try {
        const paymentResponse = await instance.orders.create(options);
        return res.status(200).json({
            success: true,
            message: paymentResponse,
        })
        //error response if any
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            error: error,
            message: "kya error hai bhai"
        })
    }
}

exports.verifyPayment = async (req, res) => {
    toast.loading("Verifying payment...")
    console.log("verifySignature.")
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses
    const userId = req.user.id

    if (!razorpay_order_id || !razorpay_payment_id || !courses || !userId || !razorpay_signature) {
        return res.status(200).json({
            success: false,
            message: "Enter all fields for verification"
        })
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");

    if (expectedSignature !== razorpay_signature) {
        //enroll the student
        await enrollStudent(courses, userId, res);
        return res.status(200).json({
            success: true,
            message: "Payment verified"
        })
    }
    return res.status(201).json({
        success: true, message: "Payment failed"
    })

}

const enrollStudent = async (courses, userId, res) => {
    console.log("enrolling student in")
    if (!courses || !userId) {
        return res.status(400).json({
            success: false,
            message: "please provde course and userid"
        })
    }

    //muiltiple courses hai to student ko har jagah enroll karna pdega
    try {
        for (const courseId of courses) {
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true }
            )

            if (!enrolledCourse) {
                return res.status(400).json({
                    success: false,
                    message: "Course not found"
                })
            }
            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            })
            //find the student and add to their list of enrolled courses
            console.log("enrolleed studentssssssssssssssssssssssssss")
            const enrolledStudent = await User.findOneAndUpdate(userId, {
                $push: {
                    courses: courseId,
                    courseProgress: courseProgress._id,
                },
            }, { new: true })


            //mail send to user
            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfull Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
            )
            console.log("Email sent successfully", emailResponse)
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Error occured"
        })
    }
}

exports.sendPaymentSucessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;

    const userId = req.user.id

    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({
            success: false,
            message: "Provide all fields in send payments"
        })
    }
    try {
        //student ko find
        const enrolledStudent = await User.findById(userId)
        await mailSender(
            enrolledStudent.email,
            `Payment Recieved`,
            paymentSuccessEmail(`${enrolledStudent.firstName}`, amount / 100, orderId, paymentId)
        )

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Email couldnot send",
            error: error
        })
    }


}
