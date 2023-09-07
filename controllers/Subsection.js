const Subsection = require("../models/SubSection")
const Section = require("../models/Section")

exports.createSubSection = async (req, res) => {
    try {
        //data fetch
        const { sectionId, title, timeDuration, description } = req.body;
        //extract file/video
        const video = req.files.videoFile;
        //validation
        if (!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(200).json({
                success: false,
            })
        }
        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDERNAME)
        //create a sub-section
        const subSectionDetails = await Subsection.create({
            title,
            timeDuration,
            description,
            video: uploadDetails.secure_url,
        })
        //update section with this subsection objectId
        const updatedSection = await Section.findByIdAndUpdate(sectionId,
            {
                $push: {
                    subSection: subSectionDetails._id
                },
            },
            { new: true })
        //HW log updated section here by populating the query

        //return response
        return res.json({
            success: true,
            message: "Subsection Created successfully",
            updatedSection
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Cannot  Create Subsection ",
        })
    }
}

//update
exports.updateSubSection = async (req, res) => {
}
//delete
exports.deleteSubSection = async (req, res) => {
}