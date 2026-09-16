import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await register(name, email, password, adminCode);
      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Create Account</h2>
      <p className="auth-subtitle">Join LearnHub today</p>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="John Doe"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Admin Passcode (Optional)</label>
          <input
            type="text"
            className="form-input"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            placeholder="Leave blank for student account"
          />
          <span className="form-help">Only required if registering as an instructor / administrator.</span>
        </div>

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Creating Account..." : "Register"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "#64748b" }}>
        Already have an account? <Link to="/login" style={{ color: "#2563eb", fontWeight: 600 }}>Login</Link>
      </p>
    </div>
  );
};

export default Register;
