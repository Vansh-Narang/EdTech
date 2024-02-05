const SubSection = require("../models/SubSection")
const Section = require("../models/Section")

exports.createSubSection = async (req, res) => {
    try {
        //data fetch
        const { sectionId, title, timeDuration, description } = req.body;
        //extract file/video
        // const video = req.files.videoFile;
        //validation
        if (!sectionId || !title || !timeDuration || !description)
        // !video)
        {
            return res.status(200).json({
                success: false,
            })
        }
        //upload video to cloudinary
        // const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDERNAME)
        //create a sub-section
        const subSectionDetails = await Subsection.create({
            title,
            timeDuration,
            description,
            // video: uploadDetails.secure_url,
        })
        //update section with this subsection objectId
        const updatedSection = await Section.findByIdAndUpdate(sectionId,
            {
                $push: {
                    subSection: subSectionDetails._id
                },
            },
            { new: true })
            .populate("subSection")
        //HW log updated section here by populating the query

        //return response
        return res.json({
            success: true,
            message: "Subsection Created successfully",
            data: updatedSection
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Cannot  Create Subsection ",
        })
    }
}//testing done

exports.updateSubSection = async (req, res) => {
    try {
        const { sectionId, subSectionId, title, description } = req.body
        const subSection = await SubSection.findById(subSectionId)

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            })
        }

        if (title !== undefined) {
            subSection.title = title
        }

        if (description !== undefined) {
            subSection.description = description
        }
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }

        await subSection.save()

        const updatedSection = await Section.findById(sectionId).populate("subSection")


        return res.json({
            success: true,
            data: updatedSection,
            message: "Section updated successfully",
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the section",
        })
    }
}

exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        )
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

        if (!subSection) {
            return res
                .status(404)
                .json({ success: false, message: "SubSection not found" })
        }

        const updatedSection = await Section.findById(sectionId).populate("subSection")

        return res.json({
            success: true,
            data: updatedSection,
            message: "SubSection deleted successfully",
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the SubSection",
        })
    }
}