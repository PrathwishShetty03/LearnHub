import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ roleRequired }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="main-content"><p>Loading access rights...</p></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
