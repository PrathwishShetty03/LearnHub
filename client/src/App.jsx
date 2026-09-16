import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import StudentDashboard from "./pages/StudentDashboard";
import CourseDetail from "./pages/CourseDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";

import MyCourses from "./pages/MyCourses";
import LessonView from "./pages/LessonView";

import AdminDashboard from "./pages/AdminDashboard";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";
import CourseStudents from "./pages/CourseStudents";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<StudentDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses/:id" element={<CourseDetail />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/student/my-courses" element={<MyCourses />} />
              <Route path="/student/courses/:id/learn" element={<LessonView />} />
            </Route>

            <Route element={<ProtectedRoute roleRequired="admin" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/courses/new" element={<CreateCourse />} />
              <Route path="/admin/courses/:id/edit" element={<EditCourse />} />
              <Route path="/admin/courses/:id/students" element={<CourseStudents />} />
            </Route>

            <Route path="*" element={<StudentDashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
