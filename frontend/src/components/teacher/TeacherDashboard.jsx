import React, { useState } from 'react';
import TeacherProfileForm from './TeacherProfileForm';
import TeacherCoursesManager from './TeacherCoursesManager';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import '../common/Sidebar.css';
import './TeacherDashboard.css';
import { FaUser, FaBook, FaEnvelope, FaChartBar, FaMoneyBillWave } from 'react-icons/fa';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Tạo menu item cho profile-info
  const profileMenuItem = {
    id: 'profile-info',
    label: 'Trần Hậu Nam',
    subLabel: 'haunam3112',
    isProfile: true
  };

  const menuItems = [
    profileMenuItem,
    { 
      id: 'profile', 
      label: 'Thông tin cá nhân',
      icon: <FaUser className="nav-icon" />,
      color: 'blue'
    },
    { 
      id: 'courses', 
      label: 'Quản lý khóa học',
      icon: <FaBook className="nav-icon" />,
      color: 'green'
    },
    { 
      id: 'messages', 
      label: 'Tin nhắn',
      icon: <FaEnvelope className="nav-icon" />,
      color: 'purple'
    },
    { 
      id: 'stats', 
      label: 'Thống kê',
      icon: <FaChartBar className="nav-icon" />,
      color: 'orange'
    },
    { 
      id: 'revenue', 
      label: 'Doanh thu',
      icon: <FaMoneyBillWave className="nav-icon" />,
      color: 'emerald'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <TeacherProfileForm />;
      case 'courses':
      return <TeacherCoursesManager />;
      case 'messages':
        return <div>Tin nhắn</div>;
      case 'stats':
        return <div>Thống kê</div>;
      case 'revenue':
        return <div>Doanh thu</div>;
      default:
        return null;
    }
  };

  return (
    <>
      <Header onProfileClick={() => setShowProfileModal(true)} />
      <div className="teacher-dashboard">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          menuItems={menuItems} 
          onProfileClick={() => setShowProfileModal(true)}
        />
        <div className="dashboard-main">
          <div className="dashboard-content">
            <div className="content-header">
            </div>
            {renderContent()}
          </div>
        </div>
      </div>

      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Hồ sơ cá nhân</h2>
              <button 
                className="modal-close"
                onClick={() => setShowProfileModal(false)}
              >
                ×
              </button>
            </div>
            <TeacherProfileForm />
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherDashboard; 