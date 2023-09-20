const User = require("../models/User")
const OTP = require("../models/Otp")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const mailSender = require("../utils/mailSender")

//otp send

//FLOW->req.body se email le aao
//if user already exist no otp generate
//generate new otp store in db also and send to user
//response send

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user is already present
        // Find user with provided email
        const checkUserPresent = await User.findOne({ email });
        // to be used in case of signup

        // If user found with provided email
        if (checkUserPresent) {
            // Return 401 Unauthorized status code with error message
            return res.status(401).json({
                success: false,
                message: `User is Already Registered`,
            });
        }

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        const result = await OTP.findOne({ otp: otp });
        console.log("Result is Generate OTP Func");
        console.log("OTP", otp);
        console.log("Result", result);
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            });
        }
        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP Body", otpBody);
        res.status(200).json({
            success: true,
            message: `OTP Sent Successfully`,
            otp,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};//send otp tested


//sign up


exports.signup = async (req, res) => {

    //data fetch
    try {
        const { firstName, lastName, email,
            password, confirmPassword,
            accountType, contactNumber,
            otp } = req.body;

        //validate
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        //2 passwords match (pass and cpassword)
        if (password !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "Passwords do not match",
            })
        }
        //check user exist or not

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(200).json({
                message: "User already exists",
                success: false,
            })
        }
        //find most recently otp
        //verification of mail when signUp
        const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1)
        console.log("Recent otp is", recentOTP)

        //validate otp
        if (recentOTP.length === 0) {
            //otp not found
            return res.status(404).json({
                message: "otp not valid ",
                success: false,
            })
        }
        //match the otp
        else if (recentOTP[0].otp !== otp) {
            return res.status(404).json({
                message: "otp not valid",
                success: false,
            })
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //entry create

        const ProfileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })


        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: ProfileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
        })
        //return res
        res.status(200).json({
            success: true,
            message: "User created successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Not able to signup"
        })
    }
}




//login
exports.login = async (req, res) => {
    try {

        //get data from request

        const { email, password } = req.body

        //validation

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        //user exist or not exist

        const user = await User.findOne({ email }).populate("additionalDetails")
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered yet, please sign up"
            })
        }

        //generate jwt token after matching the password

        if (await bcrypt.compare(password, user.password)) {

            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType.role
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h"
            })
            user.token = token
            //adding the token to the response data and making password null in the response after storing in the database
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 + 1000),
                httpOnly: true,
            }
            //create cookie and send response
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in"
            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Password dont match"
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Cannot login",
            error: error,
            success: false

        })
    }
}



//change password

exports.changePassword = async (req, res) => {
    //get data
    //get old pass , new pass, confirm password
    try {
        const { email, password, newPassword, newCpassword } = req.body;

        const existUser = await User.findOne({ email })
        if (!existUser) {
            return res.status(401).json({
                success: false,
                message: "The user with this email doesn't exosts"
            })
        }
        //validation all and password with confirm password
        if (!password || !newPassword || !newCpassword) {
            return res.status(400).json({
                status: false,
                message: "Enter all fields of password"
            })
        }

        //update password in DB with new password

        if (newCpassword === newPassword) {
            const hashedPassword = bcrypt.hash(newCpassword, 10)
            const response = await User.findOneAndUpdate(
                { email: email, },
                { password: hashedPassword }
            )
            console.log(response)
        }
        //send mail -password updated
        const sendMail = await mailSender(email, "Password updated");
        console.log(sendMail)
        //return response
        res.status(200).json({
            success: true,
            message: "Password updated"
        })
    } catch (error) {
        res.status(400).json({
            messsage: "Passwords do not match",
            error: error,
            success: false
        })
    }
}