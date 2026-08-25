import './App.css'
import { Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursePage";
import TeachersPage from "./pages/TeacherPage";
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
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import PromotionDetailPage from "./pages/PromotionDetailedPage";
import NewsDetailPage from "./pages/NewsDetailedPage";
import ScrollToTop from "./components/ScrollToTop.tsx";
import {Suspense } from 'react';

const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 transition-colors">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
    </div>
);

function App() {
    useDarkMode();
  return (
      <>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
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
                      <Route path="/profile-settings" element={<ProfileSettingsPage/>} />
                  </Route>
                  <Route path="/reviews" element={<ReviewsPage />} />
                  <Route element={<ProtectedRoute allowedRoles={['teacher', 'admin']} />}>
                      <Route path="/teacher-dashboard" element={<TeacherDashboardPage />} />
                  </Route>

                  <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                      <Route path="/admin-panel" element={<AdminPanelPage />} />
                  </Route>
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/news/:id" element={<NewsDetailPage />} />
                  <Route path="/promotions/:id" element={<PromotionDetailPage />} />
              </Route>
          </Routes>
          </Suspense>
      </>

  )
}

export default App
