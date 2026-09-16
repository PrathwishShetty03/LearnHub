import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { token } = useContext(AuthContext);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      if (!res.ok) throw new Error("Failed to load courses");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${courseTitle}"? This will delete all its lessons and student enrollments.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete course");
      }
      setSuccess(`Course "${courseTitle}" removed successfully`);
      setCourses(courses.filter((c) => c._id !== courseId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="main-content"><p>Loading admin portal...</p></div>;
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p style={{ color: "#64748b", marginTop: "0.25rem" }}>
            Manage courses, lessons, and view student progress
          </p>
        </div>
        <Link to="/admin/courses/new" className="btn-primary" style={{ width: "auto", padding: "0.6rem 1.2rem" }}>
          + Create New Course
        </Link>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      {courses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", background: "white", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
          <h3>No courses created yet.</h3>
          <p style={{ color: "#64748b", margin: "0.5rem 0 1.5rem 0" }}>
            Get started by creating your first course!
          </p>
          <Link to="/admin/courses/new" className="btn-primary" style={{ display: "inline-block", width: "auto", padding: "0.6rem 1.5rem" }}>
            Create Course
          </Link>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Instructor</th>
              <th>Price</th>
              <th>Lessons</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      style={{ width: "50px", height: "40px", objectFit: "cover", borderRadius: "0.25rem" }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/50x40";
                      }}
                    />
                    <div>
                      <strong style={{ display: "block", color: "#0f172a" }}>{course.title}</strong>
                      <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                        Created: {new Date(course.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </td>
                <td>{course.instructorName}</td>
                <td>${course.price}</td>
                <td>{course.lessons ? course.lessons.length : 0}</td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/admin/courses/${course._id}/edit`} className="btn-secondary" style={{ fontSize: "0.8rem", padding: "0.35rem 0.7rem" }}>
                      Edit / Lessons
                    </Link>
                    <Link to={`/admin/courses/${course._id}/students`} className="btn-secondary" style={{ fontSize: "0.8rem", padding: "0.35rem 0.7rem", backgroundColor: "#3b82f6" }}>
                      Students
                    </Link>
                    <button
                      onClick={() => handleDeleteCourse(course._id, course.title)}
                      className="btn-danger"
                      style={{ fontSize: "0.8rem", padding: "0.35rem 0.7rem" }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
