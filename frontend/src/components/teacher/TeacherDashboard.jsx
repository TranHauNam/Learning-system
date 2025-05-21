import React, { useState } from 'react';
import TeacherProfileForm from './TeacherProfileForm';
import AddCourseForm from './AddCourseForm';
import Header from '../common/Header';
import './TeacherDashboard.css';
import { FaBook, FaChalkboardTeacher, FaChartBar } from 'react-icons/fa';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [showProfileModal, setShowProfileModal] = useState(false);

  const menuItems = [
    { id: 'courses', label: 'Thêm khóa học', icon: <FaBook className="nav-icon" /> },
    { id: 'teaching', label: 'Lớp học của tôi', icon: <FaChalkboardTeacher className="nav-icon" /> },
    { id: 'stats', label: 'Thống kê', icon: <FaChartBar className="nav-icon" /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'courses':
        return <AddCourseForm />;
      case 'teaching':
        return <div>Danh sách lớp học</div>;
      case 'stats':
        return <div>Thống kê</div>;
      default:
        return null;
    }
  };

  return (
    <div className="teacher-dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Teacher Portal</h1>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <div
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      <div className="dashboard-main">
        <Header onProfileClick={() => setShowProfileModal(true)} />
        <div className="dashboard-content">
          <div className="content-header">
            <h2 className="content-title">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h2>
          </div>
          {renderContent()}
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
    </div>
  );
};

export default TeacherDashboard; 