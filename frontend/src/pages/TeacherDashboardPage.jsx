import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherDashboard from '../components/teacher/TeacherDashboard';
import { ROUTES, USER_ROLES } from '../constants/config';

const TeacherDashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra authentication và role
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate(ROUTES.LOGIN);
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (!user.token || user.role !== USER_ROLES.TEACHER) {
        navigate(ROUTES.LOGIN);
      }
    } catch (error) {
      navigate(ROUTES.LOGIN);
    }
  }, [navigate]);

  return <TeacherDashboard />;
};

export default TeacherDashboardPage; 