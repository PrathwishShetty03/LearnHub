import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const EditCourse = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [lessons, setLessons] = useState([]);

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonOrder, setLessonOrder] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addingLesson, setAddingLesson] = useState(false);
  const [updatingCourse, setUpdatingCourse] = useState(false);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${id}`);
      if (!res.ok) throw new Error("Course not found");
      const data = await res.json();

      setTitle(data.title);
      setDescription(data.description);
      setInstructorName(data.instructorName);
      setPrice(data.price);
      setThumbnail(data.thumbnail);
      setLessons(data.lessons || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUpdatingCourse(true);

    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          instructorName,
          price: Number(price),
          thumbnail
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update course");
      }

      setSuccess("Course details updated successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingCourse(false);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setAddingLesson(true);

    try {
      const res = await fetch(`/api/courses/${id}/lessons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: lessonTitle,
          content: lessonContent,
          orderNumber: lessonOrder ? Number(lessonOrder) : lessons.length + 1
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add lesson");
      }

      setSuccess(`Lesson "${data.title}" added successfully!`);
      setLessonTitle("");
      setLessonContent("");
      setLessonOrder("");
      fetchCourse();
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingLesson(false);
    }
  };

  if (loading) {
    return <div className="main-content"><p>Loading course editor...</p></div>;
  }

  return (
    <div className="main-content">
      <div style={{ marginBottom: "1.5rem" }}>
        <Link to="/admin/dashboard" style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 600 }}>
          ← Back to Admin Dashboard
        </Link>
        <h1 className="page-title" style={{ marginTop: "0.5rem" }}>Manage Course: {title}</h1>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div style={{ background: "white", padding: "1.75rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.25rem", color: "#0f172a" }}>
            Course Information
          </h2>
          <form onSubmit={handleUpdateCourse}>
            <div className="form-group">
              <label className="form-label">Course Title</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
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
              />
            </div>

            <div className="form-group">
              <label className="form-label">Thumbnail URL</label>
              <input
                type="url"
                className="form-input"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-primary" disabled={updatingCourse}>
              {updatingCourse ? "Updating..." : "Save Course Details"}
            </button>
          </form>
        </div>

        <div>
          <div style={{ background: "white", padding: "1.75rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.25rem", color: "#0f172a" }}>
              Add New Lesson
            </h2>
            <form onSubmit={handleAddLesson}>
              <div className="form-group">
                <label className="form-label">Lesson Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  required
                  placeholder="e.g., Introduction to Express.js"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Order Number</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={lessonOrder}
                  onChange={(e) => setLessonOrder(e.target.value)}
                  placeholder={`Default: ${lessons.length + 1}`}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lesson Content (Text or Video Embed URL)</label>
                <textarea
                  className="form-textarea"
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  required
                  placeholder="Enter lesson text or paste a video URL (e.g. https://www.youtube.com/watch?v=...)"
                ></textarea>
              </div>

              <button type="submit" className="btn-secondary" style={{ width: "100%", backgroundColor: "#16a34a" }} disabled={addingLesson}>
                {addingLesson ? "Adding Lesson..." : "+ Add Lesson to Course"}
              </button>
            </form>
          </div>

          <div style={{ background: "white", padding: "1.75rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#0f172a" }}>
              Existing Lessons ({lessons.length})
            </h3>
            {lessons.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: "0.9rem" }}>No lessons created for this course yet.</p>
            ) : (
              <div className="lessons-list">
                {lessons.map((lesson, idx) => (
                  <div key={lesson._id} className="lesson-item">
                    <div>
                      <strong style={{ color: "#1e293b" }}>
                        #{lesson.orderNumber || idx + 1}: {lesson.title}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
