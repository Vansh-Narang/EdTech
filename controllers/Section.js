const Section = require("../models/Section")
const Course = require("../models/Course")
const SubSection = require("../models/SubSection")


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
}//testing done

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
}//testing done

//delete section
exports.deleteSection = async (req, res) => {
    try {

        const { sectionId, courseId } = req.body;
        await Course.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId,
            }
        })
        const section = await Section.findById(sectionId);
        console.log(sectionId, courseId);
        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not Found",
            })
        }

        //delete sub section
        await SubSection.deleteMany({ _id: { $in: section.subSection } });

        await Section.findByIdAndDelete(sectionId);

        //find the updated course and return 
        const course = await Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        })
            .exec();

        res.status(200).json({
            success: true,
            message: "Section deleted",
            data: course
        });
    } catch (error) {
        console.error("Error deleting section:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};//testing done