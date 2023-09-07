const express = require("express")
const router = express.Router();

const { createCourse, showAllCourses, getCourseDetails } = require("../controllers/Course")
const { showAllCategories, createCategory, categoryPageDetails } = require("../controllers/Category")
const { createSection, updateSection, deleteSection } = require("../controllers/Section")
const { createSubSection, updateSubSection, deleteSubSection } = require("../controllers/Subsection");
const {createRating,getAverageRating,getAllRating,getAllReviewsForCourse } = require("../controllers/RatingAndReview")

//middlewares routes
