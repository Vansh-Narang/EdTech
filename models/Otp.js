const mongoose = require('mongoose');
const mailSender = require("../utils/mailSender")
const OTPschema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60
    }
})
//mail send for otp sending
//user -> data ->mail aaya -> otp enter (submit)->db me entry create kro
//mail send (pre)

//a function ->to send mail
async function sendVerificationMail(email, otp) {
    try {
        const mailResponse = await mailSender(email, "Verification Mail", otp)
        console.log("mail send success", mailResponse)
    } catch (error) {
        console.log("Mail not send", error)
        throw error
    }
}


//pre
OTPschema.pre("save", async function (next) {
    //next pass krne se next work me chle jata hai
    await sendVerificationMail(this.email, this.otp)
    next()
})

module.exports = mongoose.model('OtpSchema', OTPschema);