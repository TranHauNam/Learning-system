import React, { useEffect, useState } from 'react';
import { teacherService } from '../../services/teacher.service';
import './TeacherCoursesManager.css';

const emptyCourse = { title: '', description: '', category: '', price: '', thumbnail: '' };
const emptyAssignment = { title: '', description: '', attachments: [''], dueDate: '' };
const emptyLecture = { title: '', description: '', video: '', documents: [''], assignments: [ { ...emptyAssignment } ] };

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
  const [categories, setCategories] = useState([]);

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

  // Thêm/xóa document
  const handleDocumentChange = (idx, value) => {
    const docs = [...lecture.documents];
    docs[idx] = value;
    setLecture({ ...lecture, documents: docs });
  };
  const addDocument = () => setLecture({ ...lecture, documents: [...lecture.documents, ''] });
  const removeDocument = (idx) => setLecture({ ...lecture, documents: lecture.documents.filter((_, i) => i !== idx) });

  // Thêm/xóa assignment
  const handleAssignmentChange = (idx, field, value) => {
    const assignments = [...lecture.assignments];
    assignments[idx][field] = value;
    setLecture({ ...lecture, assignments });
  };
  const addAssignment = () => setLecture({ ...lecture, assignments: [...lecture.assignments, { ...emptyAssignment }] });
  const removeAssignment = (idx) => setLecture({ ...lecture, assignments: lecture.assignments.filter((_, i) => i !== idx) });

  // Thêm/xóa attachment cho assignment
  const handleAttachmentChange = (aIdx, attIdx, value) => {
    const assignments = [...lecture.assignments];
    assignments[aIdx].attachments[attIdx] = value;
    setLecture({ ...lecture, assignments });
  };
  const addAttachment = (aIdx) => {
    const assignments = [...lecture.assignments];
    assignments[aIdx].attachments.push('');
    setLecture({ ...lecture, assignments });
  };
  const removeAttachment = (aIdx, attIdx) => {
    const assignments = [...lecture.assignments];
    assignments[aIdx].attachments = assignments[aIdx].attachments.filter((_, i) => i !== attIdx);
    setLecture({ ...lecture, assignments });
  };

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
            <form className="profile-form" onSubmit={handleAddLecture}>
              <div className="form-group">
                <label>Tiêu đề bài giảng</label>
                <input value={lecture.title} onChange={e => setLecture({ ...lecture, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea value={lecture.description} onChange={e => setLecture({ ...lecture, description: e.target.value })} required style={{ minHeight: 60 }} />
              </div>
              <div className="form-group">
                <label>Video (URL)</label>
                <input value={lecture.video} onChange={e => setLecture({ ...lecture, video: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Tài liệu (có thể thêm nhiều link)</label>
                {lecture.documents.map((doc, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                    <input value={doc} onChange={e => handleDocumentChange(idx, e.target.value)} style={{ flex: 1 }} />
                    <button type="button" onClick={() => removeDocument(idx)} disabled={lecture.documents.length === 1}>-</button>
                    <button type="button" onClick={addDocument}>+</button>
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label>Bài tập</label>
                {lecture.assignments.map((a, aIdx) => (
                  <div key={aIdx} style={{ border: '1px solid #e0e7ef', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                    <input placeholder="Tiêu đề bài tập" value={a.title} onChange={e => handleAssignmentChange(aIdx, 'title', e.target.value)} style={{ marginBottom: 4, width: '100%' }} />
                    <textarea placeholder="Mô tả" value={a.description} onChange={e => handleAssignmentChange(aIdx, 'description', e.target.value)} style={{ marginBottom: 4, width: '100%' }} />
                    <label>File đính kèm (nhiều link):</label>
                    {a.attachments.map((att, attIdx) => (
                      <div key={attIdx} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                        <input value={att} onChange={e => handleAttachmentChange(aIdx, attIdx, e.target.value)} style={{ flex: 1 }} />
                        <button type="button" onClick={() => removeAttachment(aIdx, attIdx)} disabled={a.attachments.length === 1}>-</button>
                        <button type="button" onClick={() => addAttachment(aIdx)}>+</button>
                      </div>
                    ))}
                    <label>Hạn nộp:</label>
                    <input type="date" value={a.dueDate ? a.dueDate.slice(0,10) : ''} onChange={e => handleAssignmentChange(aIdx, 'dueDate', e.target.value)} />
                    <button type="button" onClick={() => removeAssignment(aIdx)} disabled={lecture.assignments.length === 1} style={{ marginTop: 8, color: '#ef4444' }}>Xóa bài tập</button>
                  </div>
                ))}
                <button type="button" onClick={addAssignment} style={{ marginTop: 8 }}>+ Thêm bài tập</button>
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