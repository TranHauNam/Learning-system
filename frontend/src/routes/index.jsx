import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import { ROUTES } from '../constants/config';
import TeacherDashboardPage from '../pages/TeacherDashboardPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Redirect to login if no route matches */}
      <Route path="*" element={<Navigate to="/login" replace />} />

      <Route path={ROUTES.TEACHER_DASHBOARD} element={<TeacherDashboardPage />} />
    </Routes>
  );
};

export default AppRoutes;

