const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  instructorName: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  thumbnail: {
    type: String,
    required: true
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson"
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model("Course", courseSchema);
