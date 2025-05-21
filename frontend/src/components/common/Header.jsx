import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { authService } from '../../services/auth.service';
import './Header.css';

const Header = ({ onProfileClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
        <div className="header-title">Teacher Portal</div>
        <div className="header-right" ref={dropdownRef}>
          <div 
            className="avatar-container" 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaUserCircle className="avatar-icon" />
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