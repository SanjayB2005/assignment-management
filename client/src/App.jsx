import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import GoogleCallback from './pages/GoogleCallback';
import './App.css';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <motion.div {...pageTransition}>
              <LandingPage />
            </motion.div>
          } 
        />
        <Route 
          path="/login" 
          element={
            <motion.div {...pageTransition}>
              <Login />
            </motion.div>
          } 
        />
        <Route 
          path="/register" 
          element={
            <motion.div {...pageTransition}>
              <Register />
            </motion.div>
          } 
        />
        <Route 
          path="/auth/callback" 
          element={
            <motion.div {...pageTransition}>
              <GoogleCallback />
            </motion.div>
          } 
        />
        <Route 
          path="/teacher" 
          element={
            <motion.div {...pageTransition}>
              <ProtectedRoute requiredRole="TEACHER">
                <TeacherDashboard />
              </ProtectedRoute>
            </motion.div>
          } 
        />
        <Route 
          path="/student" 
          element={
            <motion.div {...pageTransition}>
              <ProtectedRoute requiredRole="STUDENT">
                <StudentDashboard />
              </ProtectedRoute>
            </motion.div>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <AnimatedRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
