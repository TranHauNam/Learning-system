import React, { useState } from 'react';
import StudentProfileForm from './StudentProfileForm';
import StudentCoursesManager from './StudentCoursesManager';
import StudentHeader from './StudentHeader';
import Sidebar from '../common/Sidebar';
import '../common/Sidebar.css';
import './StudentDashboard.css';
import { FaUser, FaBook, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const profileMenuItem = {
    id: 'profile-info',
    label: 'Nguyễn Văn A',
    subLabel: 'mssv123456',
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
      label: 'Khóa học của tôi',
      icon: <FaBook className="nav-icon" />, 
      color: 'green'
    },
    {
      id: 'messages',
      label: 'Tin nhắn',
      icon: <FaEnvelope className="nav-icon" />, 
      color: 'purple'
    }
  ];

  // Reset khi chuyển tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = ({ setCartCount }) => {
    switch (activeTab) {
      case 'profile':
        return <StudentProfileForm />;
      case 'courses':
        return <StudentCoursesManager />;
      case 'messages':
        return <div>Tin nhắn</div>;
      default:
        return null;
    }
  };

  return (
    <>
      <StudentHeader 
        onSearchCourses={keyword => {
          if (keyword && keyword.trim()) {
            navigate(`/student/search?keyword=${encodeURIComponent(keyword)}`);
          }
        }} 
        cartCount={cartCount}
      />
      <div className="student-dashboard">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          menuItems={menuItems}
          onProfileClick={() => setShowProfileModal(true)}
        />
        <div className="dashboard-main">
          <div className="dashboard-content">
            {renderContent({ setCartCount })}
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
            <StudentProfileForm />
          </div>
        </div>
      )}
    </>
  );
};

export default StudentDashboard; 