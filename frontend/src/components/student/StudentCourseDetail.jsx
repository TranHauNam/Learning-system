import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { studentService } from '../../services/student.service';
import StudentHeader from './StudentHeader';
import './StudentCourseDetail.css';
import { FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import { AlertContext } from '../common/alertContext';
import { CartContext } from '../common/cartContext.jsx';

const benefitList = [
  {
    icon: '🎓',
    title: 'Đầy Đủ Bài Giảng',
    desc: 'Cam kết video bài giảng và tài liệu giống mô tả'
  },
  {
    icon: '💻',
    title: 'Học Online Tiện Lợi',
    desc: 'Học online thuận lợi bằng điện thoại hoặc máy tính'
  },
  {
    icon: '⏱️',
    title: 'Kích Hoạt Nhanh',
    desc: 'Nhận khóa học tự động trong vòng 1-2 phút'
  }
];

const StudentCourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addCartLoading, setAddCartLoading] = useState(false);
  const { showAlert } = useContext(AlertContext);
  const { incrementCart } = useContext(CartContext);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await studentService.getCourseDetail(courseId);
        setCourse(res.data || res);
      } catch {
        setError('Không thể tải thông tin khóa học.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [courseId]);

  const handleAddToCart = async () => {
    if (!course?._id) return;
    setAddCartLoading(true);
    try {
      await studentService.addToCart(course._id);
      showAlert('Đã thêm vào giỏ hàng!');
      incrementCart();
    } catch {
      showAlert('Thêm vào giỏ hàng thất bại!');
    } finally {
      setAddCartLoading(false);
    }
  };

  if (loading) return <div style={{padding:32}}>Đang tải...</div>;
  if (error) return <div style={{padding:32, color:'red'}}>{error}</div>;
  if (!course) return null;

  // Lấy tên giáo viên: surname + middleName (nếu có), fallback email
  let teacherName = 'N/A';
  if (course.teacher) {
    if (course.teacher.surname || course.teacher.middleName) {
      teacherName = `${course.teacher.surname || ''} ${course.teacher.middleName || ''}`.trim();
    } else if (course.teacher.email) {
      teacherName = course.teacher.email;
    }
  }

  return (
    <>
      <StudentHeader />
      <div className="course-detail-3col-container">
        {/* Ảnh thumbnail bên trái */}
        <div className="course-detail-thumbnail">
          {course.thumbnail && (
            <img src={course.thumbnail} alt="thumbnail" />
          )}
        </div>
        {/* Thông tin ở giữa */}
        <div className="course-detail-info">
          <h2 className="course-detail-title">{course.title}</h2>
          <div className="course-detail-desc">{course.description}</div>
          <div className="course-detail-price">Giá: {course.price?.toLocaleString()}đ</div>
          <div className="course-detail-teacher">Giáo viên: {teacherName}</div>
          <div className="course-detail-action-btns">
            <button className="btn-add-cart" onClick={handleAddToCart} disabled={addCartLoading}>
              <FaShoppingCart style={{marginRight:8}} /> Thêm vào giỏ
            </button>
            <button className="btn-pay-now">
              <FaCreditCard style={{marginRight:8}} /> Thanh toán ngay
            </button>
          </div>
        </div>
        {/* Lợi ích bên phải */}
        <div className="course-detail-benefits">
          {benefitList.map((b) => (
            <div key={b.title} className="course-benefit-item">
              <span className="course-benefit-icon">{b.icon}</span>
              <div>
                <div className="course-benefit-title">{b.title}</div>
                <div className="course-benefit-desc">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StudentCourseDetail; 