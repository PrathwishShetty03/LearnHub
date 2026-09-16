import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ProgressBar from "../components/ProgressBar";

const LessonView = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseAndEnrollment = async () => {
      try {
        const resCourse = await fetch(`/api/courses/${id}`);
        if (!resCourse.ok) throw new Error("Course not found");
        const courseData = await resCourse.json();
        setCourse(courseData);

        if (courseData.lessons && courseData.lessons.length > 0) {
          setActiveLesson(courseData.lessons[0]);
        }

        const resEnrollment = await fetch("/api/enrollments/my", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (resEnrollment.ok) {
          const myEnrollments = await resEnrollment.json();
          const currentEnrollment = myEnrollments.find((e) => e.course._id === id);
          if (currentEnrollment) {
            setCompletedLessonIds(currentEnrollment.completedLessonIds || []);
            setProgressPercentage(currentEnrollment.progressPercentage || 0);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndEnrollment();
  }, [id, token]);

  const handleToggleComplete = async (lessonId) => {
    try {
      const res = await fetch("/api/enrollments/complete-lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ courseId: id, lessonId })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update lesson status");
      }

      const data = await res.json();
      setCompletedLessonIds(data.completedLessonIds);
      setProgressPercentage(data.progressPercentage);
    } catch (err) {
      setError(err.message);
    }
  };

  const renderContent = (content) => {
    if (!content) return null;

    const isUrl = content.trim().startsWith("http://") || content.trim().startsWith("https://");
    if (isUrl) {
      let videoSrc = content.trim();
      if (videoSrc.includes("youtube.com/watch?v=")) {
        const videoId = videoSrc.split("v=")[1]?.split("&")[0];
        videoSrc = `https://www.youtube.com/embed/${videoId}`;
      } else if (videoSrc.includes("youtu.be/")) {
        const videoId = videoSrc.split("youtu.be/")[1]?.split("?")[0];
        videoSrc = `https://www.youtube.com/embed/${videoId}`;
      }

      if (videoSrc.includes("youtube.com/embed/") || videoSrc.includes("player.vimeo.com")) {
        return (
          <div className="video-responsive">
            <iframe
              src={videoSrc}
              title="Lesson Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      }

      return (
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ marginBottom: "0.5rem" }}>Resource Link / Video:</p>
          <a href={content} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline", wordBreak: "break-all" }}>
            {content}
          </a>
        </div>
      );
    }

    return (
      <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.7", color: "#334155" }}>
        {content}
      </div>
    );
  };

  if (loading) {
    return <div className="main-content"><p>Loading classroom...</p></div>;
  }

  if (!course) {
    return (
      <div className="main-content">
        <div className="alert-error">Course not found</div>
        <Link to="/student/my-courses" className="btn-secondary">Back to My Courses</Link>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div style={{ marginBottom: "1.5rem" }}>
        <Link to="/student/my-courses" style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 600 }}>
          ← Back to My Courses
        </Link>
        <h1 className="page-title" style={{ marginTop: "0.5rem" }}>{course.title}</h1>
        <div style={{ maxWidth: "400px", marginTop: "0.75rem" }}>
          <ProgressBar percentage={progressPercentage} />
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="lesson-view-container">
        <div className="sidebar-lessons">
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#0f172a" }}>
            Course Lessons
          </h3>
          {(!course.lessons || course.lessons.length === 0) ? (
            <p style={{ fontSize: "0.9rem", color: "#64748b" }}>No lessons created yet.</p>
          ) : (
            course.lessons.map((lesson, idx) => {
              const isCompleted = completedLessonIds.includes(lesson._id);
              const isActive = activeLesson && activeLesson._id === lesson._id;
              return (
                <button
                  key={lesson._id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`sidebar-lesson-btn ${isActive ? "active" : ""}`}
                >
                  <span>
                    {idx + 1}. {lesson.title}
                  </span>
                  <span>{isCompleted ? "✅" : "⚪"}</span>
                </button>
              );
            })
          )}
        </div>

        <div>
          {activeLesson ? (
            <div className="lesson-content-box">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a" }}>
                  {activeLesson.title}
                </h2>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={completedLessonIds.includes(activeLesson._id)}
                    onChange={() => handleToggleComplete(activeLesson._id)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span>Mark Completed</span>
                </label>
              </div>

              {renderContent(activeLesson.content)}
            </div>
          ) : (
            <div className="lesson-content-box" style={{ textAlign: "center", color: "#64748b" }}>
              Select a lesson from the sidebar to start learning.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonView;
