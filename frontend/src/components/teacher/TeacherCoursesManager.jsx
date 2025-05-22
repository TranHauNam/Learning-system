import React, { useEffect, useState } from 'react';
import { teacherService } from '../../services/teacher.service';
import './TeacherCoursesManager.css';

const emptyCourse = { title: '', description: '', category: '', price: '', thumbnail: '' };
const emptyLecture = { title: '', content: '' };

const TeacherCoursesManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showLectureForm, setShowLectureForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourse, setNewCourse] = useState(emptyCourse);
  const [editCourse, setEditCourse] = useState(emptyCourse);
  const [lecture, setLecture] = useState(emptyLecture);
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'add'

  // Lấy danh sách khóa học
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await teacherService.getCourses();
      setCourses(res.data || []);
      setError('');
    } catch {
      setError('Không thể tải danh sách khóa học');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Thêm khóa học mới
  const handleAddCourse = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await teacherService.addCourse(newCourse);
      setShowAddForm(false);
      setNewCourse(emptyCourse);
      setSuccess('Thêm khóa học thành công!');
      fetchCourses();
    } catch {
      setError('Không thể thêm khóa học');
    }
  };

  // Xóa khóa học
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa?')) return;
    setError(''); setSuccess('');
    try {
      await teacherService.deleteCourse(id);
      setSuccess('Xóa khóa học thành công!');
      fetchCourses();
    } catch {
      setError('Không thể xóa khóa học');
    }
  };

  // Hiện form cập nhật
  const openEditForm = (course) => {
    setEditCourse(course);
    setShowEditForm(true);
    setError(''); setSuccess('');
  };

  // Cập nhật khóa học
  const handleEditCourse = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await teacherService.updateCourse(editCourse._id, editCourse);
      setShowEditForm(false);
      setEditCourse(emptyCourse);
      setSuccess('Cập nhật khóa học thành công!');
      fetchCourses();
    } catch {
      setError('Không thể cập nhật khóa học');
    }
  };

  // Hiện form thêm bài giảng
  const openLectureForm = (course) => {
    setSelectedCourse(course);
    setLecture(emptyLecture);
    setShowLectureForm(true);
    setError(''); setSuccess('');
  };

  // Thêm bài giảng
  const handleAddLecture = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await teacherService.addLecture(selectedCourse._id, lecture);
      setShowLectureForm(false);
      setLecture(emptyLecture);
      setSuccess('Thêm bài giảng thành công!');
      fetchCourses();
    } catch {
      setError('Không thể thêm bài giảng');
    }
  };

  return (
    <div className="courses-container">
      <h2>Quản lý khóa học</h2>
      <div className="form-actions" style={{ marginBottom: 20 }}>
        <button className="courses-btn" onClick={() => { setActiveTab('list'); setShowAddForm(false); setShowEditForm(false); setShowLectureForm(false); fetchCourses(); }}>Xem danh sách</button>
        <button className="courses-btn" onClick={() => { setActiveTab('add'); setShowAddForm(true); setShowEditForm(false); setShowLectureForm(false); }}>Thêm khóa học</button>
        <button className="courses-btn" onClick={fetchCourses}>Làm mới</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {loading ? (
        <p>Đang tải...</p>
      ) : activeTab === 'list' && (
        <table className="courses-table">
          <thead>
            <tr style={{ background: '#e6eefe' }}>
              <th style={{ padding: 10, borderRadius: '8px 0 0 8px' }}>Tên</th>
              <th>Mô tả</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Học sinh</th>
              <th style={{ borderRadius: '0 8px 8px 0' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course._id} style={{ background: '#f8fafc', borderBottom: '1.5px solid #e0e7ef' }}>
                <td style={{ padding: 8 }}>{course.title}</td>
                <td>{course.description}</td>
                <td>{course.category?.name || course.category}</td>
                <td>{course.price}</td>
                <td>{course.status}</td>
                <td>{course.studentCount}</td>
                <td>
                  <button className="submit-button" style={{ padding: '6px 16px', fontSize: 14, marginRight: 6 }} onClick={() => openEditForm(course)}>Cập nhật</button>
                  <button className="submit-button" style={{ padding: '6px 16px', fontSize: 14, marginRight: 6, background: '#22c55e' }} onClick={() => openLectureForm(course)}>Thêm bài giảng</button>
                  <button className="submit-button" style={{ padding: '6px 16px', fontSize: 14, background: '#ef4444' }} onClick={() => handleDelete(course._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Form thêm khóa học */}
      {showAddForm && activeTab === 'add' && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h3>Thêm khóa học</h3>
              <button className="modal-close" onClick={() => setShowAddForm(false)}>×</button>
            </div>
            <form className="profile-form" onSubmit={handleAddCourse}>
              <div className="form-group">
                <label>Tên khóa học</label>
                <input value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <input value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Danh mục</label>
                <input value={newCourse.category} onChange={e => setNewCourse({ ...newCourse, category: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Giá</label>
                <input type="number" value={newCourse.price} onChange={e => setNewCourse({ ...newCourse, price: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Ảnh thumbnail</label>
                <input value={newCourse.thumbnail} onChange={e => setNewCourse({ ...newCourse, thumbnail: e.target.value })} />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">Tạo</button>
                <button type="button" className="submit-button" style={{ background: '#b6c6e3', color: '#222', marginLeft: 8 }} onClick={() => setShowAddForm(false)}>Đóng</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Form cập nhật khóa học */}
      {showEditForm && (
        <div className="modal-overlay" onClick={() => setShowEditForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h3>Cập nhật khóa học</h3>
              <button className="modal-close" onClick={() => setShowEditForm(false)}>×</button>
            </div>
            <form className="profile-form" onSubmit={handleEditCourse}>
              <div className="form-group">
                <label>Tên khóa học</label>
                <input value={editCourse.title} onChange={e => setEditCourse({ ...editCourse, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <input value={editCourse.description} onChange={e => setEditCourse({ ...editCourse, description: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Danh mục</label>
                <input value={editCourse.category} onChange={e => setEditCourse({ ...editCourse, category: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Giá</label>
                <input type="number" value={editCourse.price} onChange={e => setEditCourse({ ...editCourse, price: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Ảnh thumbnail</label>
                <input value={editCourse.thumbnail} onChange={e => setEditCourse({ ...editCourse, thumbnail: e.target.value })} />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">Lưu</button>
                <button type="button" className="submit-button" style={{ background: '#b6c6e3', color: '#222', marginLeft: 8 }} onClick={() => setShowEditForm(false)}>Đóng</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Form thêm bài giảng */}
      {showLectureForm && (
        <div className="modal-overlay" onClick={() => setShowLectureForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h3>Thêm bài giảng cho: {selectedCourse?.title}</h3>
              <button className="modal-close" onClick={() => setShowLectureForm(false)}>×</button>
            </div>
            <form className="profile-form" onSubmit={handleAddLecture}>
              <div className="form-group">
                <label>Tên bài giảng</label>
                <input value={lecture.title} onChange={e => setLecture({ ...lecture, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Nội dung</label>
                <textarea value={lecture.content} onChange={e => setLecture({ ...lecture, content: e.target.value })} required style={{ minHeight: 80 }} />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">Thêm</button>
                <button type="button" className="submit-button" style={{ background: '#b6c6e3', color: '#222', marginLeft: 8 }} onClick={() => setShowLectureForm(false)}>Đóng</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCoursesManager; 