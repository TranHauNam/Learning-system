import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import './auth.css';
import welcomeImg from '../../assets/flat-university-concept-background.png';
import { USER_ROLES, ROUTES } from '../../constants/config';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      const userData = response.data;
      
      if (userData && userData.token && userData.role) {
        if (userData.role === USER_ROLES.STUDENT) {
          navigate(ROUTES.STUDENT_DASHBOARD);
        } else if (userData.role === USER_ROLES.TEACHER) {
          navigate(ROUTES.TEACHER_DASHBOARD);
        } else {
          setError('Vai trò người dùng không hợp lệ');
        }
      } else {
        setError('Dữ liệu phản hồi không hợp lệ');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Đăng nhập thất bại');
      } else if (err.request) {
        setError('Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối mạng.');
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-wrapper">
        <div className="auth-visual">
          <h1>Chào mừng trở lại</h1>
          <img src={welcomeImg} alt="welcome" className="auth-visual-img" />
        </div>
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">ĐĂNG NHẬP</h2>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                <span>{error}</span>
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Tên tài khoản</label>
              <input
                className="form-input"
                id="email"
                name="email"
                type="email"
                required
                placeholder="Tên tài khoản"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input
                className="form-input"
                id="password"
                name="password"
                type="password"
                required
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="auth-button"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
            <div className="auth-footer">
              <span>Chưa có tài khoản? </span>
              <a href="/register" className="auth-link">
                Đăng ký
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 