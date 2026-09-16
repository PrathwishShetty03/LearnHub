const express = require("express");
const router = express.Router();
const {
  enrollInCourse,
  getMyEnrollments,
  markLessonComplete
} = require("../controllers/enrollmentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, enrollInCourse);
router.get("/my", protect, getMyEnrollments);
router.post("/complete-lesson", protect, markLessonComplete);

module.exports = router;
