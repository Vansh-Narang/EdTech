//It basically means forgot password so we will reset the password
const User = require("../models/User")
const mailSender = require("../utils/mailSender")

exports.resetPasswordToken = async (req, res) => {

    try {
        //get mail
        const { email } = req.body
        if (!email) {
            return res.status(400).send({
                message: "Enter the mail please"
            })
        }
        //check user for this email or email validations will
        const existingUser = await User.findByEmail({ email })
        if (!existingUser) {
            return res.status(400).send({
                message: "No user found"
            })
        }

        //generate the token
        const token = crypto.randomUUID();
        //3000 for front end (generate the token)
        //update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000
            },
            {
                new: true,
            })

        //create url
        const url = `http://localhost:3000/update-password/${token}`
        //send mail containing the url
        await mailSender(email, "Password Reset Link", `Password Reset Link:${url}`)
        //return response
        res.status(200).json({
            success: true,
            message: 'Email send successful'
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Error sending password reset link'
        })
    }

}
//reset password token(with expiry time)
//reset password (db update)
exports.resetPassword = async (req, res) => {
    try {
        //data fetch
        const { password, confirmPassword, token } = req.body
        //validation
        if (!password || !confirmPassword || !token) {
            return res.status(401).json({
                message: 'All fields are required',
                success: false,
            })
        }
        if (password !== confirmPassword) {
            return res.status(401).json({
                message: "Passwords dont match",
                success: false,
            })
        }
        //user ki entry token se nikalo
        const userDetails = await User.findOne({ token: token })
        //if not entry -> invalid token
        if (!userDetails) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            })
        }
        //token time not expired
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.status(401).json({
                success: false,
                message: "Token is expired"
            })
        }
        //user ke data ko update kro (password ko hash krke)
        const hashedPassword = await password.bcrypt(password, 10);
        await User.findOne({ token: token },
            { password: hashedPassword },
            { new: true }
        )
        //return response
        res.status(200).json({
            message: "Done Successfully",
            success: true,
        })
    } catch (error) {
        res.status(401).json({
            message: "Cant reset password",
            success: false,
        })
    }
}