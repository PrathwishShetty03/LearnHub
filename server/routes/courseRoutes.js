const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addLessonToCourse,
  getCourseStudents
} = require("../controllers/courseController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", protect, adminOnly, createCourse);
router.put("/:id", protect, adminOnly, updateCourse);
router.delete("/:id", protect, adminOnly, deleteCourse);
router.post("/:id/lessons", protect, adminOnly, addLessonToCourse);
router.get("/:id/students", protect, adminOnly, getCourseStudents);

module.exports = router;
