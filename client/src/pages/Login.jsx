import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await login(email, password);
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
      <h2 className="auth-title">Welcome Back</h2>
      <p className="auth-subtitle">Sign in to your LearnHub account</p>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
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

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "#64748b" }}>
        Don't have an account? <Link to="/register" style={{ color: "#2563eb", fontWeight: 600 }}>Register</Link>
      </p>
    </div>
  );
};

export default Login;
