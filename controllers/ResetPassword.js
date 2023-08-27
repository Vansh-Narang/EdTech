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