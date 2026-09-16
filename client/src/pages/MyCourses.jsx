import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CourseCard from "../components/CourseCard";

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyEnrollments = async () => {
      try {
        const res = await fetch("/api/enrollments/my", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to load your enrolled courses");
        const data = await res.json();
        setEnrollments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEnrollments();
  }, [token]);

  if (loading) {
    return <div className="main-content"><p>Loading your courses...</p></div>;
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Courses</h1>
          <p style={{ color: "#64748b", marginTop: "0.25rem" }}>
            Track your progress and continue learning where you left off
          </p>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {enrollments.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", background: "white", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
          <h3>You haven't enrolled in any courses yet.</h3>
          <p style={{ color: "#64748b", margin: "0.5rem 0 1.5rem 0" }}>
            Explore our catalog and find the right course for you!
          </p>
          <Link to="/" className="btn-primary" style={{ display: "inline-block", width: "auto", padding: "0.6rem 1.5rem" }}>
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="course-grid">
          {enrollments.map((item) => (
            <CourseCard
              key={item.enrollmentId}
              course={item.course}
              isEnrolled={true}
              progressPercentage={item.progressPercentage}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
