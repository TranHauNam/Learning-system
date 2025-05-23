import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDashboard from '../components/student/StudentDashboard';
import { ROUTES, USER_ROLES } from '../constants/config';

const StudentDashboardPage = () => {
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
      if (!user.token || user.role !== USER_ROLES.STUDENT) {
        navigate(ROUTES.LOGIN);
      }
    } catch (error) {
      console.log(error);
      navigate(ROUTES.LOGIN);
    }
  }, [navigate]);

  return <StudentDashboard />;
};

export default StudentDashboardPage; 