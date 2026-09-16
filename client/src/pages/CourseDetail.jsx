import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await fetch(`/api/courses/${id}`);
        if (!res.ok) throw new Error("Course not found");
        const data = await res.json();
        setCourse(data);

        if (token && user && user.role === "student") {
          const resEnroll = await fetch("/api/enrollments/my", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (resEnroll.ok) {
            const enrollments = await resEnroll.json();
            const enrolled = enrollments.some((e) => e.course._id === id);
            setIsEnrolled(enrolled);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, token, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role === "admin") {
      setError("Admins cannot enroll in courses.");
      return;
    }

    setEnrolling(true);
    setError("");
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ courseId: id })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to enroll");
      }
      setIsEnrolled(true);
      setSuccess("Successfully enrolled! Redirecting to course...");
      setTimeout(() => {
        navigate(`/student/courses/${id}/learn`);
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <div className="main-content"><p>Loading course details...</p></div>;
  }

  if (!course) {
    return (
      <div className="main-content">
        <div className="alert-error">Course not found</div>
        <Link to="/" className="btn-secondary">Back to Courses</Link>
      </div>
    );
  }

  return (
    <div className="main-content">
      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <div className="detail-container">
        <div className="detail-header">
          <div>
            <h1 className="page-title">{course.title}</h1>
            <p style={{ color: "#64748b", margin: "0.5rem 0 1.5rem 0", fontSize: "1.05rem" }}>
              Instructor: <strong style={{ color: "#1e293b" }}>{course.instructorName}</strong>
            </p>
            <p style={{ lineHeight: "1.7", color: "#334155", fontSize: "1rem" }}>
              {course.description}
            </p>

            <div style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <span className="course-price" style={{ fontSize: "1.75rem" }}>
                ${course.price}
              </span>

              {isEnrolled ? (
                <Link to={`/student/courses/${id}/learn`} className="btn-primary" style={{ padding: "0.75rem 1.5rem", width: "auto" }}>
                  Go to Course Lessons
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="btn-primary"
                  style={{ padding: "0.75rem 1.5rem", width: "auto" }}
                  disabled={enrolling}
                >
                  {enrolling ? "Enrolling..." : "Enroll Now"}
                </button>
              )}
            </div>
          </div>

          <div>
            <img
              src={course.thumbnail}
              alt={course.title}
              className="detail-thumbnail"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400x250?text=Course+Image";
              }}
            />
          </div>
        </div>
      </div>

      <div className="detail-container">
        <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "1rem" }}>
          Course Syllabus ({course.lessons ? course.lessons.length : 0} Lessons)
        </h2>

        {(!course.lessons || course.lessons.length === 0) ? (
          <p style={{ color: "#64748b" }}>No lessons added to this course yet.</p>
        ) : (
          <div className="lessons-list">
            {course.lessons.map((lesson, idx) => (
              <div key={lesson._id || idx} className="lesson-item">
                <span className="lesson-title">
                  Lesson {lesson.orderNumber || idx + 1}: {lesson.title}
                </span>
                <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Preview Available
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
