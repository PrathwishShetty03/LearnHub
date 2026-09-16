const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Enrollment = require("../models/Enrollment");

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("lessons").sort({ createdAt: -1 });
    return res.json(courses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: "lessons",
      options: { sort: { orderNumber: 1 } }
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    return res.json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const { title, description, instructorName, price, thumbnail } = req.body;
    if (!title || !description || !instructorName || price === undefined || !thumbnail) {
      return res.status(400).json({ message: "All course fields are required" });
    }

    const course = await Course.create({
      title,
      description,
      instructorName,
      price: Number(price),
      thumbnail,
      lessons: []
    });

    return res.status(201).json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { title, description, instructorName, price, thumbnail } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.instructorName = instructorName || course.instructorName;
    course.price = price !== undefined ? Number(price) : course.price;
    course.thumbnail = thumbnail || course.thumbnail;

    const updatedCourse = await course.save();
    return res.json(updatedCourse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await Lesson.deleteMany({ courseId: course._id });
    await Enrollment.deleteMany({ courseId: course._id });
    await course.deleteOne();

    return res.json({ message: "Course removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addLessonToCourse = async (req, res) => {
  try {
    const { title, content, orderNumber } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required for lesson" });
    }

    const currentLessonCount = course.lessons.length;
    const lessonOrder = orderNumber ? Number(orderNumber) : currentLessonCount + 1;

    const lesson = await Lesson.create({
      courseId: course._id,
      title,
      content,
      orderNumber: lessonOrder
    });

    course.lessons.push(lesson._id);
    await course.save();

    return res.status(201).json(lesson);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("lessons");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollments = await Enrollment.find({ courseId: req.params.id })
      .populate("studentId", "name email")
      .populate("completedLessonIds");

    const totalLessons = course.lessons.length;

    const studentsData = enrollments.map((e) => {
      const completedCount = e.completedLessonIds ? e.completedLessonIds.length : 0;
      const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
      return {
        enrollmentId: e._id,
        student: e.studentId,
        enrolledAt: e.enrolledAt,
        completedCount,
        totalLessons,
        progressPercentage
      };
    });

    return res.json(studentsData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addLessonToCourse,
  getCourseStudents
};
