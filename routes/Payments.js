const express = require("express")
const router = express.Router();

const { capturePayment, verifyPayment, sendPaymentSucessEmail } = require("../controllers/Payments")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifyPayment);
router.post("/sendPaymentSucessEmail", auth, isStudent, sendPaymentSucessEmail);
module.exports = router