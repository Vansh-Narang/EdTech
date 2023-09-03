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