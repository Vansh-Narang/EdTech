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
            const decode = await jwt.verify(token, process.env.JWT_SECRET)
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
//isStudent


//is Instructor

//isAdmin