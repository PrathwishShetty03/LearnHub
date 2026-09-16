const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user._id;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    const enrollment = await Enrollment.create({
      studentId,
      courseId,
      completedLessonIds: []
    });

    return res.status(201).json(enrollment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user._id;
    const enrollments = await Enrollment.find({ studentId }).populate({
      path: "courseId",
      populate: { path: "lessons" }
    });

    const enrolledCourses = enrollments.map((e) => {
      const course = e.courseId;
      if (!course) return null;
      const totalLessons = course.lessons ? course.lessons.length : 0;
      const completedCount = e.completedLessonIds ? e.completedLessonIds.length : 0;
      const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      return {
        enrollmentId: e._id,
        course,
        enrolledAt: e.enrolledAt,
        completedLessonIds: e.completedLessonIds,
        progressPercentage,
        totalLessons,
        completedCount
      };
    }).filter(Boolean);

    return res.json(enrolledCourses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    const studentId = req.user._id;

    if (!courseId || !lessonId) {
      return res.status(400).json({ message: "Course ID and Lesson ID are required" });
    }

    const enrollment = await Enrollment.findOne({ studentId, courseId });
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment record not found for this course" });
    }

    const lessonIndex = enrollment.completedLessonIds.indexOf(lessonId);
    if (lessonIndex > -1) {
      enrollment.completedLessonIds.splice(lessonIndex, 1);
    } else {
      enrollment.completedLessonIds.push(lessonId);
    }

    await enrollment.save();

    const course = await Course.findById(courseId).populate("lessons");
    const totalLessons = course ? course.lessons.length : 0;
    const completedCount = enrollment.completedLessonIds.length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return res.json({
      enrollmentId: enrollment._id,
      completedLessonIds: enrollment.completedLessonIds,
      progressPercentage,
      totalLessons,
      completedCount
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  markLessonComplete
};
