import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import { ROUTES } from '../constants/config';
import TeacherDashboardPage from '../pages/TeacherDashboardPage';
import StudentDashboardPage from '../pages/StudentDashboardPage';
import StudentCourseDetail from '../components/student/StudentCourseDetail';
import StudentSearchPage from '../components/student/StudentSearchPage';
import StudentCartPage from '../components/student/StudentCartPage';
import StudentHome from '../components/student/StudentHome';
import StudentLearnPage from '../components/student/StudentLearnPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Redirect to login if no route matches */}
      <Route path="*" element={<Navigate to="/login" replace />} />

      <Route path={ROUTES.TEACHER_DASHBOARD} element={<TeacherDashboardPage />} />
      <Route path={ROUTES.STUDENT_DASHBOARD} element={<StudentDashboardPage />} />
      <Route path="/student/course/:courseId" element={<StudentCourseDetail />} />
      <Route path="/student/search" element={<StudentSearchPage />} />
      <Route path="/student/cart" element={<StudentCartPage />} />
      <Route path="/student/home" element={<StudentHome />} />
      <Route path="/student/course/:courseId/learn" element={<StudentLearnPage />} />
    </Routes>
  );
};

export default AppRoutes;

