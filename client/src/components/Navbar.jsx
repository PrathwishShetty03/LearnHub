import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🎓 LearnHub
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              <Link
                to="/"
                className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
              >
                Browse Courses
              </Link>

              {user.role === "student" && (
                <Link
                  to="/student/my-courses"
                  className={`nav-link ${location.pathname === "/student/my-courses" ? "active" : ""}`}
                >
                  My Courses
                </Link>
              )}

              {user.role === "admin" && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`nav-link ${location.pathname.startsWith("/admin") ? "active" : ""}`}
                  >
                    Admin Dashboard
                  </Link>
                </>
              )}

              <span className="user-badge">{user.role}</span>
              <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{user.name}</span>

              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`nav-link ${location.pathname === "/register" ? "active" : ""}`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
