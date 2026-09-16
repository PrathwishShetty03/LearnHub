import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import CourseCard from "../components/CourseCard";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [enrollmentProgress, setEnrollmentProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCourses = await fetch("/api/courses");
        if (!resCourses.ok) {
          throw new Error("Failed to load courses");
        }
        const dataCourses = await resCourses.json();
        setCourses(dataCourses);

        if (token && user && user.role === "student") {
          const resEnrollments = await fetch("/api/enrollments/my", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (resEnrollments.ok) {
            const dataEnrollments = await resEnrollments.json();
            const ids = dataEnrollments.map((e) => e.course._id);
            const progressMap = {};
            dataEnrollments.forEach((e) => {
              progressMap[e.course._id] = e.progressPercentage;
            });
            setEnrolledCourseIds(ids);
            setEnrollmentProgress(progressMap);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user]);

  if (loading) {
    return <div className="main-content"><p>Loading courses...</p></div>;
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Explore Courses</h1>
          <p style={{ color: "#64748b", marginTop: "0.25rem" }}>
            Expand your knowledge with interactive online lessons
          </p>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {courses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", background: "white", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
          <h3>No courses available yet.</h3>
          <p style={{ color: "#64748b", marginTop: "0.5rem" }}>Check back later or sign in as an admin to create a course.</p>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course._id);
            const progressPercentage = enrollmentProgress[course._id];
            return (
              <CourseCard
                key={course._id}
                course={course}
                isEnrolled={isEnrolled}
                progressPercentage={progressPercentage}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
