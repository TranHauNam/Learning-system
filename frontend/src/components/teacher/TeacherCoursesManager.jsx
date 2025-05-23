import React, { useEffect, useState, useContext } from 'react';
import { teacherService } from '../../services/teacher.service';
import './TeacherCoursesManager.css';
import { AlertContext } from '../common/alertContext.jsx';

const emptyCourse = { title: '', description: '', category: '', price: '', thumbnail: '' };
const emptyAssignment = { title: '', description: '', attachments: [], dueDate: '' };
const emptyLecture = { title: '', description: '', video: null, documents: [], assignments: [ { ...emptyAssignment } ] };

const TeacherCoursesManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showLectureForm, setShowLectureForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourse, setNewCourse] = useState(emptyCourse);
  const [editCourse, setEditCourse] = useState(emptyCourse);
  const [lecture, setLecture] = useState(emptyLecture);
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'add'
  const [categories, setCategories] = useState([]);
  const { showAlert } = useContext(AlertContext);

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

  // Lấy danh mục từ API
  const fetchCategories = async () => {
    try {
      const res = await teacherService.getCategories();
      setCategories(res.data || []);
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (showAddForm || showEditForm) fetchCategories();
  }, [showAddForm, showEditForm]);

  // Thêm khóa học mới
  const handleAddCourse = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await teacherService.addCourse(newCourse);
      setNewCourse(emptyCourse);
      showAlert('Thêm khóa học thành công!');
      fetchCourses();
    } catch {
      setError('Không thể thêm khóa học');
    }
  };

  // Xóa khóa học
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa?')) return;
    setError('');
    try {
      await teacherService.deleteCourse(id);
      showAlert('Xóa khóa học thành công!');
      fetchCourses();
    } catch {
      setError('Không thể xóa khóa học');
    }
  };

  // Hiện form cập nhật
  const openEditForm = (course) => {
    setEditCourse(course);
    setShowEditForm(true);
    setError('');
  };

  // Cập nhật khóa học
  const handleEditCourse = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await teacherService.updateCourse(editCourse._id, editCourse);
      setShowEditForm(false);
      setEditCourse(emptyCourse);
      showAlert('Cập nhật khóa học thành công!');
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
    setError('');
  };

  // Thêm hàm chuyển file sang base64
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Thêm bài giảng
  const handleAddLecture = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Xử lý base64 cho video và documents
      let videoBase64 = null;
      if (lecture.video) {
        videoBase64 = await fileToBase64(lecture.video);
      }
      let documentsBase64 = [];
      if (lecture.documents && lecture.documents.length > 0) {
        documentsBase64 = await Promise.all(
          lecture.documents.map(fileToBase64)
        );
      }
      // Xử lý base64 cho attachments trong assignments
      const assignments = await Promise.all(
        lecture.assignments.map(async (a) => {
          let attachmentsBase64 = [];
          if (a.attachments && a.attachments.length > 0) {
            attachmentsBase64 = await Promise.all(a.attachments.map(fileToBase64));
          }
          return {
            ...a,
            attachments: attachmentsBase64,
          };
        })
      );
      const payload = {
        ...lecture,
        video: videoBase64,
        documents: documentsBase64,
        assignments,
      };
      await teacherService.addLecture(selectedCourse._id, payload);
      setShowLectureForm(false);
      setLecture(emptyLecture);
      showAlert('Thêm bài giảng thành công!');
      fetchCourses();
    } catch {
      setError('Không thể thêm bài giảng');
    }
  };

  // Xử lý file video
  const handleVideoChange = (e) => {
    setLecture({ ...lecture, video: e.target.files[0] });
  };

  // Xử lý file tài liệu
  const handleDocumentsChange = (e) => {
    setLecture({ ...lecture, documents: Array.from(e.target.files) });
  };

  // Xử lý file đính kèm cho assignment
  const handleAttachmentsChange = (aIdx, e) => {
    const assignments = [...lecture.assignments];
    assignments[aIdx].attachments = Array.from(e.target.files);
    setLecture({ ...lecture, assignments });
  };

  // Thêm lại các hàm cho assignment:
  const handleAssignmentChange = (idx, field, value) => {
    const assignments = [...lecture.assignments];
    assignments[idx][field] = value;
    setLecture({ ...lecture, assignments });
  };
  const addAssignment = () => setLecture({ ...lecture, assignments: [...lecture.assignments, { title: '', description: '', attachments: [], dueDate: '' }] });
  const removeAssignment = (idx) => setLecture({ ...lecture, assignments: lecture.assignments.filter((_, i) => i !== idx) });

  return (
    <div className="profile-container">
      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => { setActiveTab('list'); setShowAddForm(false); setShowEditForm(false); setShowLectureForm(false); fetchCourses(); }}
        >
          Xem danh sách
        </button>
        <button
          className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => { setActiveTab('add'); setShowAddForm(true); setShowEditForm(false); setShowLectureForm(false); }}
        >
          Thêm khóa học
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
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

      {/* Form thêm khóa học trực tiếp, không dùng modal */}
      {showAddForm && activeTab === 'add' && (
        <div style={{marginTop: 24 }}>
          <form className="profile-form" onSubmit={handleAddCourse}>
            <div className="form-group">
              <label>Tên khóa học</label>
              <input className="form-input" value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Mô tả</label>
              <input className="form-input" value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Danh mục</label>
              <select
                className="form-input"
                value={newCourse.category}
                onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Giá</label>
              <input className="form-input" type="number" value={newCourse.price} onChange={e => setNewCourse({ ...newCourse, price: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Ảnh thumbnail</label>
              <input className="form-input" value={newCourse.thumbnail} onChange={e => setNewCourse({ ...newCourse, thumbnail: e.target.value })} />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-button">Tạo</button>
              <button type="button" className="submit-button" style={{ background: '#b6c6e3', color: '#222', marginLeft: 8 }} onClick={() => { setShowAddForm(false); setActiveTab('list'); }}>Đóng</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal cập nhật khóa học */}
      {showEditForm && (
        <div className="modal-overlay" onClick={() => setShowEditForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
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
                <select
                  value={editCourse.category}
                  onChange={e => setEditCourse({ ...editCourse, category: e.target.value })}
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
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

      {/* Modal thêm bài giảng */}
      {showLectureForm && (
        <div className="modal-overlay" onClick={() => setShowLectureForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Thêm bài giảng cho: {selectedCourse?.title}</h3>
              <button className="modal-close" onClick={() => setShowLectureForm(false)}>×</button>
            </div>
            <form className="profile-form" onSubmit={handleAddLecture} encType="multipart/form-data">
              <div className="form-group">
                <label>Tiêu đề bài giảng</label>
                <input value={lecture.title} onChange={e => setLecture({ ...lecture, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea value={lecture.description} onChange={e => setLecture({ ...lecture, description: e.target.value })} required style={{ minHeight: 60 }} />
              </div>
              <div className="form-group">
                <label>Video</label>
                <input type="file" accept="video/*" onChange={handleVideoChange} />
                {lecture.video && <span style={{ fontSize: 13, color: '#2563eb' }}>{lecture.video.name}</span>}
              </div>
              <div className="form-group">
                <label>Tài liệu</label>
                <input type="file" multiple onChange={handleDocumentsChange} />
                {lecture.documents && lecture.documents.length > 0 && (
                  <ul style={{ fontSize: 13, color: '#2563eb', margin: 0, paddingLeft: 18 }}>
                    {lecture.documents.map((f, idx) => <li key={idx}>{f.name}</li>)}
                  </ul>
                )}
              </div>
              <div className="form-group">
                <label>Bài tập</label>
                {lecture.assignments.map((a, aIdx) => (
                  <div key={aIdx} className="lecture-assignment-box">
                    <input placeholder="Tiêu đề bài tập" value={a.title} onChange={e => handleAssignmentChange(aIdx, 'title', e.target.value)} style={{ marginBottom: 4, width: '100%' }} />
                    <textarea placeholder="Mô tả" value={a.description} onChange={e => handleAssignmentChange(aIdx, 'description', e.target.value)} style={{ marginBottom: 4, width: '100%' }} />
                    <label>File đính kèm</label>
                    <input type="file" multiple onChange={e => handleAttachmentsChange(aIdx, e)} />
                    {a.attachments && a.attachments.length > 0 && (
                      <ul style={{ fontSize: 13, color: '#2563eb', margin: 0, paddingLeft: 18 }}>
                        {a.attachments.map((f, idx) => <li key={idx}>{f.name}</li>)}
                      </ul>
                    )}
                    <label>Hạn nộp</label>
                    <input type="date" value={a.dueDate ? a.dueDate.slice(0,10) : ''} onChange={e => handleAssignmentChange(aIdx, 'dueDate', e.target.value)} />
                    <button type="button" onClick={() => removeAssignment(aIdx)} disabled={lecture.assignments.length === 1} className="remove-assignment-btn">Xóa bài tập</button>
                  </div>
                ))}
                <button type="button" onClick={addAssignment} className="add-assignment-btn">+ Thêm bài tập</button>
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