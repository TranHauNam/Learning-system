import React, { useState, useRef, useEffect, useContext } from 'react';
import SearchBar from '../common/SearchBar';
import { FaUserCircle, FaHome, FaGraduationCap, FaBookOpen, FaRegIdBadge, FaShoppingCart } from 'react-icons/fa';
import './StudentHeader.css';
import { CartContext } from '../common/cartContext.jsx';
import { useNavigate } from 'react-router-dom';

const StudentHeader = ({ onSearchCourses }) => {
  const [searchValue, setSearchValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [avatar, setAvatar] = useState(null);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAvatar = localStorage.getItem('studentAvatar');
    if (storedAvatar) setAvatar(storedAvatar);
    const handleStorage = (event) => {
      if (event.key === 'studentAvatar') {
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

  const handleSearch = () => {
    if (onSearchCourses) onSearchCourses(searchValue);
    setSearchValue('');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="student-header">
      <div className="student-header-content">
        {/* Logo */}
        <div className="student-header-logo">
          <div className="logo-circle">M</div>
        </div>
        {/* Search */}
        <div className="student-header-search">
          <SearchBar
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onSearch={handleSearch}
          />
        </div>
        {/* Menu icons */}
        <div className="student-header-menu-icons">
          <FaHome className="menu-icon" onClick={() => navigate('/student/home')} />
          <FaGraduationCap className="menu-icon" />
          <FaBookOpen className="menu-icon" />
          <FaRegIdBadge className="menu-icon" />
        </div>
        {/* Cart + Avatar + Dropdown */}
        <div className="student-header-right" ref={dropdownRef}>
          <button className="header-cart-btn" onClick={() => navigate('/student/cart')}>
            <div style={{position:'relative', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </div>
          </button>
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
              <button className="dropdown-item" onClick={() => window.location.href='/student/home'}>
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

export default StudentHeader; 