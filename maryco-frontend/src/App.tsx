import './App.css'
import { Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursePage";
import TeachersPage from "./pages/Teacher";
import ContactPage from "./pages/ContactPage";



function App() {
  return (
      <Routes>
        <Route path="/" element={<MainLayout/>}>
            <Route index element={<HomePage/>} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="courses/category/:categoryId" element={<CoursesPage />} />
        </Route>
      </Routes>
  )
}

export default App
