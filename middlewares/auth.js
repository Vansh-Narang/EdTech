const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User")


//auth
exports.auth = async (req, res, next) => {
    try {
        //check authorization is done or not by checking the json web token

        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ", "");

        //token missing
        if (!token) {
            return res.status(400).json({
                message: "Token is missing",
                success: false,
            })
        }
        //verify the token using the secret key
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            console.log(decode)
            req.user = decode
        } catch (error) {
            //verification failed
            return res.status(400).json({
                success: false,
                message: "Token is invalid"
            })
        }
        next();
    } catch (error) {
        return res.status(400).json({
            message: "Authorization error",
            success: false,
        })
    }
}
//Humne payload me role (login ke time pr)daala hai aur authorization wale middleware me role add kiya hai jisse hum check karte hain ki 
//wo student hai admin ya instructor hai

//isStudent
exports.isStudent = async (req, res, next) => {
    try {
        //1st method -> role se check kr lo

        if (req.user.accountType !== 'Student') {
            return res.status(403).json({
                message: "Role is not a student, protected route for student",
                success: false,
            })
        }
        next()
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Cannot get student role , please try again",
            error: error,
            success: false
        })
    }
}

//is Instructor
exports.isInstructor = async (req, res, next) => {
    try {
        //1st method -> role se check kr lo

        if (req.user.accountType !== 'Instructor') {
            return res.status(403).json({
                message: "Role is not a Instructor, protected route for Instructor",
                success: false,
            })
        }
        next()
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Cannot get student role , please try again",
            error: error,
            success: false
        })
    }
}
//isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        //1st method -> role se check kr lo

        if (req.user.accountType !== 'Admin') {
            return res.status(403).json({
                message: "Role is not a Admin, protected route for Admin",
                success: false,
            })
        }
        next()
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Cannot get student role , please try again",
            error: error,
            success: false
        })
    }
}