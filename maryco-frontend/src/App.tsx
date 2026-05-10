import './App.css'
import { Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursePage";
import TeachersPage from "./pages/Teacher";
import ContactPage from "./pages/ContactPage";
import CourseDetailPage from "./pages/DetailedCoursePage";
import useDarkMode from "./hooks/UseDarkMode.ts";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import ProfilePage from "./pages/ProfilePage";
import ForbiddenPage from "./pages/ForbiddenPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import ReviewsPage from "./pages/ReviewsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";



function App() {
    useDarkMode();
  return (
      <Routes>
        <Route path="/" element={<MainLayout/>}>
            <Route index element={<HomePage/>} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="courses/category/:categoryId" element={<CoursesPage />} />
            <Route path="courses/:slug" element={<CourseDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/403" element={<ForbiddenPage />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['teacher', 'admin']} />}>
                <Route path="/teacher-dashboard" element={<TeacherDashboardPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin-panel" element={<AdminPanelPage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['user', 'teacher','admin']} />}>
                <Route path="/reviews" element={<ReviewsPage />} />
            </Route>
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Routes>
  )
}

export default App
