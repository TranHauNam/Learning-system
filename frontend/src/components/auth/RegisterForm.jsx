import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import './auth.css';
import welcomeImg from '../../assets/flat-university-concept-background.png';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    reenterPassword: '',
    role: 'student',
    otp: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register(
        formData.email,
        formData.password,
        formData.reenterPassword,
        formData.role
      );
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.verifyOtp(formData.otp);
      if (response.data.role === 'student') {
        navigate('/student/complete-profile');
      } else {
        navigate('/teacher/complete-profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Xác thực OTP thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-wrapper">
        <div className="auth-visual">
          <h1>Chào mừng bạn đăng ký</h1>
          <img src={welcomeImg} alt="welcome" className="auth-visual-img" />
        </div>
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">ĐĂNG KÝ</h2>
            <div className="auth-desc">
              Tạo tài khoản để bắt đầu học tập cùng Mapstudy
            </div>
          </div>
          {step === 1 ? (
            <form className="auth-form" onSubmit={handleRegister}>
              {error && (
                <div className="error-message">
                  <span>{error}</span>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Nhập email của bạn"
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
                  placeholder="Nhập mật khẩu của bạn"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Xác nhận mật khẩu</label>
                <input
                  className="form-input"
                  id="reenterPassword"
                  name="reenterPassword"
                  type="password"
                  required
                  placeholder="Nhập lại mật khẩu của bạn"
                  value={formData.reenterPassword}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Vai trò</label>
                <select
                  className="form-input"
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="student">Học sinh</option>
                  <option value="teacher">Giáo viên</option>
                </select>
              </div>
              <button
                className="auth-button"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </button>
              <div className="auth-footer">
                <span>Đã có tài khoản? </span>
                <a href="/login" className="auth-link">
                  Đăng nhập
                </a>
              </div>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleVerifyOtp}>
              {error && (
                <div className="error-message">
                  <span>{error}</span>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Mã OTP</label>
                <input
                  className="form-input"
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  placeholder="Nhập mã OTP"
                  value={formData.otp}
                  onChange={handleChange}
                />
              </div>
              <button
                className="auth-button"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Đang xác thực...' : 'Xác thực OTP'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 