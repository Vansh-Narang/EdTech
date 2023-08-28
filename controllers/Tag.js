const Tag = require("../models/tags")


exports.createTag = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        //create entry in db
        const tagDetails = await Tag.create({
            name, description
        })
        console.log(tagDetails)

        return res.status(200).json({
            success: true,
            message: "Tags created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: error,
            success: false
        })
    }
}

//get all tags
exports.showAllTags = async (req, res) => {
    try {
        const allTags = await Tag.find({}, { name: true, description: true })
        res.status(200).json({
            success: true,
            message: "All tags returned successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error,
        })
    }
}