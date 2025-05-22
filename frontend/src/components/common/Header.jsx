import React, { useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaHome, FaGraduationCap, FaBookOpen, FaRegIdBadge } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import './Header.css';

const Header = ({ onProfileClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const storedAvatar = localStorage.getItem('teacherAvatar');
    if (storedAvatar) setAvatar(storedAvatar);

    const handleStorage = (event) => {
      if (event.key === 'teacherAvatar') {
        setAvatar(event.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  return (
    <div className="header">
      <div className="header-content">
        {/* Logo */}
        <div className="header-logo">
          <div className="logo-circle">M</div>
        </div>
        {/* Menu icons căn giữa */}
        <div className="header-menu-icons">
          <FaHome className="menu-icon" />
          <FaGraduationCap className="menu-icon" />
          <FaBookOpen className="menu-icon" />
          <FaRegIdBadge className="menu-icon" />
        </div>
        {/* Avatar + Dropdown */}
        <div className="header-right" ref={dropdownRef}>
          <div 
            className="avatar-container" 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {avatar ? (
              <img src={avatar} alt="avatar" className="avatar-icon" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <FaUserCircle className="avatar-icon" />
            )}
          </div>
          {showDropdown && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={onProfileClick}>
                Hồ sơ cá nhân
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header; 