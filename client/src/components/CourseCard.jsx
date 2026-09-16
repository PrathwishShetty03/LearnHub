import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";

const CourseCard = ({ course, isEnrolled, progressPercentage, adminView }) => {
  return (
    <div className="course-card">
      <img
        src={course.thumbnail || "https://via.placeholder.com/300x180?text=Course+Thumbnail"}
        alt={course.title}
        className="course-thumbnail"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300x180?text=Course+Thumbnail";
        }}
      />
      <div className="course-card-body">
        <h3 className="course-card-title">{course.title}</h3>
        <p className="course-instructor">By {course.instructorName}</p>
        <p className="course-price">${course.price}</p>
        <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1rem" }}>
          {course.lessons ? course.lessons.length : 0} Lessons
        </p>

        {isEnrolled && progressPercentage !== undefined && (
          <ProgressBar percentage={progressPercentage} />
        )}

        <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
          {adminView ? (
            <Link to={`/admin/courses/${course._id}/edit`} className="btn-primary" style={{ display: "block", textAlign: "center" }}>
              Manage Course
            </Link>
          ) : isEnrolled ? (
            <Link to={`/student/courses/${course._id}/learn`} className="btn-primary" style={{ display: "block", textAlign: "center" }}>
              Continue Learning
            </Link>
          ) : (
            <Link to={`/courses/${course._id}`} className="btn-secondary" style={{ display: "block", textAlign: "center" }}>
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
