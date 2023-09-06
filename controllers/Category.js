const Category = require("../models/Category")


exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        //create entry in db
        const CategoryDetails = await Category.create({
            name, description
        })
        console.log(CategoryDetails)

        return res.status(200).json({
            success: true,
            message: "Category created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: error,
            success: false
        })
    }
}

//get all tags
exports.showAllCategories = async (req, res) => {
    try {
        //return all the tags in db but they must have name and description
        const allTags = await Category.find({}, { name: true, description: true })
        res.status(200).json({
            success: true,
            data: allTags,
            message: "All Category returned successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error,
        })
    }
}

