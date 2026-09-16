import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          instructorName: instructorName || user.name,
          price: Number(price),
          thumbnail: thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60"
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create course");
      }

      navigate(`/admin/courses/${data._id}/edit`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="main-content" style={{ maxWidth: "700px" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link to="/admin/dashboard" style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 600 }}>
          ← Back to Admin Dashboard
        </Link>
        <h1 className="page-title" style={{ marginTop: "0.5rem" }}>Create New Course</h1>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div style={{ background: "white", padding: "2rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Course Title</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g., Modern Web Development Masterclass"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Instructor Name</label>
            <input
              type="text"
              className="form-input"
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              required
              placeholder="e.g., Jane Smith"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Price ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="form-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="e.g., 49.99"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Thumbnail Image URL</label>
            <input
              type="url"
              className="form-input"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              required
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Course Description</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Provide a comprehensive summary of what students will learn in this course..."
            ></textarea>
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Creating Course..." : "Create Course & Add Lessons"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
