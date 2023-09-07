//profile to bni hui hai sirf update krna hai

const Profile = require("../models/Profile")
const User = require("../models/User")

//update profile
exports.updateProfile = async (req, res) => {
    try {//req user humesha id lata hai aur role aur email bhi

        //get data
        const { dateOfBirth = "", about = "", contactNumber, gender } = req.body
        //user id
        const id = req.user.id
        //validation
        if (!gender || !id || !contactNumber) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }
        //find profile
        const userDetails = await User.findById(id)
        const profileId = userDetails.additionalDetails.profile
        //update profie
        const profileDetails = await Profile.findById(profileId)
        profileDetails.dateOfBirth = dateOfBirth
        profileDetails.gender = gender
        profileDetails.contactNumber = contactNumber
        profileDetails.about = about

        await profileDetails.save()

        //return response
        res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            profileDetails
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error,
            message: "Error updating profile"
        })
    }
}

//delete account
exports.deleteAccount = async (req, res) => {
    try {
        //fetch data
        const id = req.user.id

        //validate profile
        const userDetails = await User.findById(id)
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "No profile for the id"
            })
        }
        //find by id and delete
        await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails })
        await User.findByIdAndDelete({ _id: id })
        //json response


        //to do [hw enroll when profile get deleted ]


        res.status(200).json({
            success: true,
            message: "Deleted profile successfully"
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error,
            message: "Error deleting profile"
        })
    }
}

//get user details
exports.getUserDetails = async (req, res) => {
    try {
        //fetch data
        const id = req.user.id
        //validate
        if (!id) {
            return res.status(404).json({
                success: false,
                message: "Id not found"
            })
        }
        //find
        const userDetails = await User.findById(id).populate("addittionalDetails").exec()
        //return response
        res.status(200).json({
            success: true,
            message: "Returned data"
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error,
            message: "Error deleting profile"
        })
    }
}

//two exports are left
exports.getEnrolledCourses = async (req, res) => { }
exports.updateDisplayPicture = async (req, res) => { }