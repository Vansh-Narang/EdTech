const Razoprpay=require("razorpay")


exports.instance=new Razoprpay({
    key_id:process.env.RAZORPAY_KEY,
    key_secret:process.env.RAZORPAY_SECRET,
})