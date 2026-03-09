import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyNotice from "./pages/VerifyNotice";

// Protected learning pages
import CourseDetails from "./pages/CourseDetails";
import Lesson from "./pages/Lesson";
import Quiz from "./pages/Quiz";
import Dashboard from "./pages/Dashboard";
import StudentResults from "./pages/StudentResult";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify" element={<VerifyNotice />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/course/:id"
          element={
            <ProtectedRoute>
              <CourseDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lesson/:courseId/:lessonId"
          element={
            <ProtectedRoute>
              <Lesson />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/:courseId/:lessonId"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <StudentResults />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </>
  );
}