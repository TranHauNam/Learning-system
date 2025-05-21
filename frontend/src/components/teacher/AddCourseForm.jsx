import React, { useState } from 'react';
import './AddCourseForm.css';

const AddCourseForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: '',
    thumbnail: null,
    duration: '',
    requirements: '',
    objectives: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseData(prev => ({
        ...prev,
        thumbnail: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // TODO: Implement API call to create course
      const formData = new FormData();
      Object.keys(courseData).forEach(key => {
        formData.append(key, courseData[key]);
      });

      // await courseService.createCourse(formData);
      setSuccess('Tạo khóa học mới thành công!');
      // Reset form
      setCourseData({
        title: '',
        description: '',
        category: '',
        level: 'beginner',
        price: '',
        thumbnail: null,
        duration: '',
        requirements: '',
        objectives: ''
      });
    } catch (error) {
      console.error(error);
      setError('Không thể tạo khóa học mới');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-form-container">
      <h2>Tạo Khóa Học Mới</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Thông tin cơ bản</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Tên khóa học *</label>
              <input
                type="text"
                name="title"
                value={courseData.title}
                onChange={handleInputChange}
                required
                placeholder="Nhập tên khóa học"
              />
            </div>
            <div className="form-group">
              <label>Danh mục *</label>
              <select
                name="category"
                value={courseData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Chọn danh mục</option>
                <option value="programming">Lập trình</option>
                <option value="design">Thiết kế</option>
                <option value="business">Kinh doanh</option>
                <option value="language">Ngoại ngữ</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cấp độ *</label>
              <select
                name="level"
                value={courseData.level}
                onChange={handleInputChange}
                required
              >
                <option value="beginner">Người mới bắt đầu</option>
                <option value="intermediate">Trung cấp</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </div>
            <div className="form-group">
              <label>Học phí (VNĐ) *</label>
              <input
                type="number"
                name="price"
                value={courseData.price}
                onChange={handleInputChange}
                required
                min="0"
                placeholder="Nhập học phí"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Thời lượng (giờ) *</label>
              <input
                type="number"
                name="duration"
                value={courseData.duration}
                onChange={handleInputChange}
                required
                min="1"
                placeholder="Ví dụ: 10"
              />
            </div>
            <div className="form-group">
              <label>Ảnh thu nhỏ *</label>
              <input
                type="file"
                name="thumbnail"
                onChange={handleThumbnailChange}
                accept="image/*"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Mô tả khóa học</h3>
          
          <div className="form-group">
            <label>Mô tả chi tiết *</label>
            <textarea
              name="description"
              value={courseData.description}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="Mô tả chi tiết về khóa học"
            />
          </div>

          <div className="form-group">
            <label>Yêu cầu đầu vào</label>
            <textarea
              name="requirements"
              value={courseData.requirements}
              onChange={handleInputChange}
              rows="3"
              placeholder="Các yêu cầu cần có trước khi tham gia khóa học"
            />
          </div>

          <div className="form-group">
            <label>Mục tiêu khóa học *</label>
            <textarea
              name="objectives"
              value={courseData.objectives}
              onChange={handleInputChange}
              required
              rows="3"
              placeholder="Những gì học viên sẽ đạt được sau khóa học"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Đang tạo...' : 'Tạo khóa học'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourseForm; 