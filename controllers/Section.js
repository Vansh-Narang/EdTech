const Section = require("../models/Section")
const Course = require("../models/Course")



exports.createSection = async (req, res) => {
    try {
        //data fetch
        const { sectionName, courseId } = req.body
        //validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All files are requiredS"
            })
        }
        //create section
        const newSection = await Section.create({ sectionName })
        //update the course 
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    //push means courseContent ke aandar newSection ki id
                    courseContent: newSection._id
                }
            },
            { new: true }
        )
        //use populate for populating the section and subsection

        //res return
        res.status(200).json({
            success: true,
            message: "Done with section creation",
            updatedCourseDetails,
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Unable to create section"
        })
    }
}

//update section
exports.updateSection = async (req, res) => {
    try {
        //data input
        const { sectionName, sectionId } = req.body;

        //data validation
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "All section parameters are requiredS"
            })
        }
        //data updated
        const updatedSection = await Section.findByIdAndUpdate(sectionId,
            { sectionName },
            { new: true })

        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            updatedSection
        })
        //retun response
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Unable to update the section"
        })
    }
}

//delete section
exports.deleteSection = async (req, res) => {
    try {
        //ask for the section id that we are asking the id from routes :id
        const { sectionId } = req.params;

        //find the section
        if (!sectionId) {
            return res.status(404).json({
                success: false,
                message: 'Cannot find the id',
            })
        }
        //make the call to db to delete the section
        await Section.findByIdAndDelete(sectionId);

        res.status(200).json({
            success: true,
            message: "Section deleted successfully",
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Unable to delete the section"
        })
    }
}