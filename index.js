const express = require('express');
const app = express();
const userRoutes = require("./routes/User")
const profileRoutes = require("./routes/Profile")
const courseRoutes = require("./routes/Course")
const paymentRoutes = require("./routes/Payments")
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser")
const cors = require("cors")
const { cloudinaryConnect } = require("./config/cloudinary")
const fileUpload = require("express-fileupload")
const dotenv = require("dotenv")
//database coonect
mongoose.connect('mongodb://127.0.0.1:27017/edTech')
const con = mongoose.connection
con.on('open', function () {
    console.log("connected ");
})

const PORT = process.env.PORT || 4000;

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    //request entertain from frontend
    origin: "http://localhost:3000",
    credentials: true,

}))

app.use(
    fileUpload({
        useTempFiles: true,
        tempDir: "/tmp"
    })
)
//cloudinary connect
cloudinaryConnect()


app.use("/api/v1/auth", userRoutes)
// app.use("/api/v1/proifle", profileRoutes)
// app.use("/api/v1/course", courseRoutes)
// app.use("/api/v1/payment", paymentRoutes)

//default
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up there"
    })
})

app.listen(PORT, () => {
    console.log("Listening on Port", PORT)
})