const Category = require("../models/Category")

//create a category
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
}//testing done

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

//category Page Details
exports.categoryPageDetails = async (req, res) => {
    try {
        //category id is required
        const { categoryId } = req.body
        //get courses for specified category
        const selectedCategory = await Category.findById(categoryId).populate("courses").exec()//shayad course aayega check while testing
        //validation for courses in category
        if (!selectedCategory) {
            return res.status(400).json({
                success: false,
                message: "couldnot find courses for category"
            })
        }
        //get courses for different categories
        const differentCategories = await Category.find({
            //aaise categories ka data lao jiski category iski category id ki equal nahi for recommended courses
            //ne means not equal
            _id: { $ne: categoryId },
        }).populate("courses").exec()
        //get top selling courses
        //(konsa course kitne baar bik gya hai )


        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategories,
            }
        })

    } catch (error) {
        console.log(error)
        res.status(404).json({
            error: error,
            message: "error in categoryPageDetails"
        })
    }
}