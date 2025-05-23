import React, { useState, useEffect, useContext } from 'react';
import { teacherService } from '../../services/teacher.service';
import './TeacherProfileForm.css';
import { AlertContext } from '../common/alertContext.jsx';

const TeacherProfileForm = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
  const { showAlert } = useContext(AlertContext);

  useEffect(() => {
    loadTeacherProfile();
  }, []);

  const loadTeacherProfile = async () => {
    try {
      const response = await teacherService.getTeacherProfile();
    if (response.data) {
      const { province, ward, school, birthday, ...profileInfo } = response.data;
      setProfileData({
        ...profileInfo,
        birthday: birthday ? new Date(birthday).toISOString().slice(0, 10) : ''
      });
      setAddressData({ province, ward, school });
      }
    } catch {
      setError('Không thể tải thông tin hồ sơ');
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({
          ...profileData,
          avatar: reader.result // base64
        });
      };
      reader.readAsDataURL(file);
    }
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

    try {
      await teacherService.updateProfile(profileData);
      showAlert('Cập nhật thành công!');
      if (profileData.avatar) {
        localStorage.setItem('teacherAvatar', profileData.avatar);
        window.dispatchEvent(new StorageEvent('storage', { key: 'teacherAvatar', newValue: profileData.avatar }));
      }
    } catch {
      setError('Không thể cập nhật thông tin cá nhân');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await teacherService.updateAddress(addressData);
      showAlert('Cập nhật địa chỉ thành công!');
    } catch {
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
            Thông tin cơ bản
        </button>
        <button
          className={`tab-button ${activeTab === 'address' ? 'active' : ''}`}
          onClick={() => setActiveTab('address')}
        >
          Địa chỉ công tác
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

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
            <label>Tên</label>
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
            <label>Ảnh đại diện</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ marginTop: '8px' }}
            />
            {profileData.avatar && (
              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <img
                  src={profileData.avatar}
                  alt="Avatar preview"
                  style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #e0e7ef' }}
                />
              </div>
            )}
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