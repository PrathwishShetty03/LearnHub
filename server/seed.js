const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const Course = require("./models/Course");
const Lesson = require("./models/Lesson");

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    await Course.deleteMany({});
    await Lesson.deleteMany({});
    console.log("Cleared existing courses and lessons.");

    const seedDataPath = path.join(__dirname, "courses_seed.json");
    const rawData = fs.readFileSync(seedDataPath, "utf-8");
    const coursesData = JSON.parse(rawData);

    for (const courseItem of coursesData) {
      const course = await Course.create({
        title: courseItem.title,
        description: courseItem.description,
        instructorName: courseItem.instructorName,
        price: courseItem.price,
        thumbnail: courseItem.thumbnail,
        lessons: []
      });

      const lessonIds = [];
      for (const lessonItem of courseItem.lessons) {
        const lesson = await Lesson.create({
          courseId: course._id,
          title: lessonItem.title,
          content: lessonItem.content,
          orderNumber: lessonItem.orderNumber
        });
        lessonIds.push(lesson._id);
      }

      course.lessons = lessonIds;
      await course.save();
      console.log(`Seeded course "${course.title}" with ${lessonIds.length} lessons.`);
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
