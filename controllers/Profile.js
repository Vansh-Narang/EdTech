//profile to bni hui hai sirf update krna hai

const Profile = require("../models/Profile")
const User = require("../models/User")


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
            message: "Profile Updated Successfully"
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "Error updating profile"
        })
    }
}