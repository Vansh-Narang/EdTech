const express = require("express")
const router = express.Router();

const { createCourse, showAllCourses, getCourseDetails } = require("../controllers/Course")
const { showAllCategories, createCategory, categoryPageDetails } = require("../controllers/Category")
const { createSection, updateSection, deleteSection } = require("../controllers/Section")
const { createSubSection, updateSubSection, deleteSubSection } = require("../controllers/Subsection");
const { createRating, getAverageRating, getAllRating, getAllReviewsForCourse } = require("../controllers/RatingAndReview")

//middlewares routes
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")


//courses will only be created by instructor
router.post("/createCourse", auth, isInstructor, createCourse)

router.get("/getAllCourses", auth, isInstructor, showAllCourses)

//add a section to a course
router.post("/addSection", auth, isInstructor, createSection)

//update a section
router.post("/updateSection", auth, isInstructor, updateSection)

//delete a section
router.post("/deleteSection", auth, isInstructor, deleteSection)

//delete sub section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)

//edit subsection
router.post("editSubsection", auth, isInstructor, updateSubSection)

//add a subsection to a section
router.post("/addSubSection", auth, isInstructor, createSubSection)


/****************************************************category**************************/
router.get("/showAllCategories", showAllCategories);

router.post("/createCategory", auth, createCategory)

router.post("/getCategoryPageDetails", categoryPageDetails)



/*********************************************rating and reviews***************/
router.post("/createRating", auth, isStudent, createRating)

router.get("/getAverageRating", getAverageRating)

router.get("/getReviews", getAllRating)


module.exports = router


