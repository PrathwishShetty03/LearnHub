import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ProgressBar from "../components/ProgressBar";

const CourseStudents = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCourse = await fetch(`/api/courses/${id}`);
        if (!resCourse.ok) throw new Error("Course not found");
        const courseData = await resCourse.json();
        setCourse(courseData);

        const resStudents = await fetch(`/api/courses/${id}/students`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resStudents.ok) throw new Error("Failed to load enrolled students");
        const studentsData = await resStudents.json();
        setStudents(studentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (loading) {
    return <div className="main-content"><p>Loading enrolled students...</p></div>;
  }

  return (
    <div className="main-content">
      <div style={{ marginBottom: "1.5rem" }}>
        <Link to="/admin/dashboard" style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 600 }}>
          ← Back to Admin Dashboard
        </Link>
        <h1 className="page-title" style={{ marginTop: "0.5rem" }}>
          Enrolled Students - {course ? course.title : ""}
        </h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem" }}>
          Total Enrolled Students: {students.length}
        </p>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {students.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", background: "white", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
          <h3>No students enrolled in this course yet.</h3>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Email</th>
              <th>Enrolled Date</th>
              <th>Lessons Completed</th>
              <th style={{ width: "220px" }}>Completion Progress</th>
            </tr>
          </thead>
          <tbody>
            {students.map((item) => (
              <tr key={item.enrollmentId}>
                <td>
                  <strong style={{ color: "#0f172a" }}>
                    {item.student ? item.student.name : "Unknown Student"}
                  </strong>
                </td>
                <td>{item.student ? item.student.email : "N/A"}</td>
                <td>{new Date(item.enrolledAt).toLocaleDateString()}</td>
                <td>
                  {item.completedCount} / {item.totalLessons}
                </td>
                <td>
                  <ProgressBar percentage={item.progressPercentage} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CourseStudents;
