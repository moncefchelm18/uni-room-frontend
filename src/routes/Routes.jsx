import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/landing/LandingPage";
import LoginForm from "../pages/auth/LoginForm";
import SignupForm from "../pages/auth/SignupForm";
import NotFound from "../pages/common/NotFound";
import ProtectedRoutes from "./ProtectedRoutes";
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentProfile from "../pages/student/StudentProfile";
import StudentContact from "../pages/student/StudentContact";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminStudents from "../pages/admin/AdminStudents";
import AdminContactMessages from "../pages/admin/AdminContact";
import HousingDashboard from "../pages/service/HousingDashboard";
import HousingRequests from "../pages/service/HousingRequests";
import HousingStudents from "../pages/service/HousingStudents";
import AdminSiteMaintenance from "@/pages/admin/AdminSiteMaintenance";
import StudentRoomInfos from "@/pages/student/StudentRoomInfos";

/**
 * Application routes configuration
 * @returns {React.ReactElement} Routes component
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoutes />}>
        {/* Student Routes */}
        <Route path="student" element={<StudentDashboard />} />
        <Route path="student/profile" element={<StudentProfile />} />
        <Route path="student/room" element={<StudentRoomInfos />} />
        <Route path="student/contact" element={<StudentContact />} />

        {/* Admin Routes */}
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/students" element={<AdminStudents />} />
        <Route path="admin/requests" element={<AdminContactMessages />} />
        <Route
          path="admin/site-maintenance"
          element={<AdminSiteMaintenance />}
        />

        {/* Housing Manager Routes */}
        <Route path="service" element={<HousingDashboard />} />
        <Route path="service/requests" element={<HousingRequests />} />
        <Route path="service/students" element={<HousingStudents />} />

        {/* Default redirect based on role */}
        <Route index element={<Navigate to="/dashboard/student" replace />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
