import React, { useState, useEffect } from 'react';
import { teacherService } from '../../services/teacher.service';
import './TeacherProfileForm.css';

const TeacherProfileForm = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileData, setProfileData] = useState({
    surname: '',
    middleName: '',
    gender: '',
    birthday: '',
    avatar: ''
  });

  const [addressData, setAddressData] = useState({
    province: '',
    ward: '',
    schoold: ''
  });

  useEffect(() => {
    loadTeacherProfile();
  }, []);

  const loadTeacherProfile = async () => {
    try {
      const response = await teacherService.getTeacherProfile();
      if (response.data) {
        const { province, ward, school, ...profileInfo } = response.data;
        setProfileData(profileInfo);
        setAddressData({ province, ward, school });
      }
    } catch (err) {
      setError('Không thể tải thông tin hồ sơ');
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddressChange = (e) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await teacherService.updateProfile(profileData);
      setSuccess('Cập nhật thông tin cá nhân thành công!');
    } catch (err) {
      setError('Không thể cập nhật thông tin cá nhân');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await teacherService.updateAddress(addressData);
      setSuccess('Cập nhật địa chỉ thành công!');
    } catch (err) {
      setError('Không thể cập nhật địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Thông tin cá nhân
        </button>
        <button
          className={`tab-button ${activeTab === 'address' ? 'active' : ''}`}
          onClick={() => setActiveTab('address')}
        >
          Địa chỉ
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {activeTab === 'info' ? (
        <form className="profile-form" onSubmit={handleProfileSubmit}>
          <div className="form-group">
            <label>Họ</label>
            <input
              type="text"
              name="surname"
              value={profileData.surname}
              onChange={handleProfileChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Tên đệm</label>
            <input
              type="text"
              name="middleName"
              value={profileData.middleName}
              onChange={handleProfileChange}
            />
          </div>
          <div className="form-group">
            <label>Giới tính</label>
            <select
              name="gender"
              value={profileData.gender}
              onChange={handleProfileChange}
              required
              className="form-input"
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div className="form-group">
            <label>Ngày sinh</label>
            <input
              type="date"
              name="birthday"
              value={profileData.birthday}
              onChange={handleProfileChange}
            />
          </div>
          <div className="form-group">
            <label>Ảnh đại diện (URL)</label>
            <input
              type="text"
              name="avatar"
              value={profileData.avatar}
              onChange={handleProfileChange}
              placeholder="Dán link ảnh hoặc upload"
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
          </button>
        </form>
      ) : (
        <form className="profile-form" onSubmit={handleAddressSubmit}>
          <div className="form-group">
            <label>Tỉnh/Thành phố</label>
            <input
              type="text"
              name="province"
              value={addressData.province}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Quận/Huyện</label>
            <input
              type="text"
              name="ward"
              value={addressData.ward}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Trường</label>
            <input
              type="text"
              name="school"
              value={addressData.school}
              onChange={handleAddressChange}
              required
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Đang cập nhật...' : 'Cập nhật địa chỉ'}
          </button>
        </form>
      )}
    </div>
  );
};

export default TeacherProfileForm; 