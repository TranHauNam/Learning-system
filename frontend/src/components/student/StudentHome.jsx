import React, { useEffect, useState } from 'react';
import { studentService } from '../../services/student.service';
import StudentHeader from './StudentHeader';
import './StudentHome.css';
import { useNavigate } from 'react-router-dom';
import { FaBookOpen, FaRegSmileBeam } from 'react-icons/fa';

const StudentHome = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await studentService.getPurchasedCourses();
        setCourses(Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []));
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // const handleCourseClick = (courseId) => {
  //   navigate(`/student/course/${courseId}`);
  // };

  const handleLearnClick = (courseId) => {
    navigate(`/student/course/${courseId}/learn`);
  };

  return (
    <>
      <StudentHeader onSearchCourses={keyword => {
        if (keyword && keyword.trim()) {
          navigate(`/student/search?keyword=${encodeURIComponent(keyword)}`);
        }
      }} />
      <div className="student-home-main">
        <div className="home-banner">
          <div className="banner-icon"><FaRegSmileBeam size={38} /></div>
          <div>
            <h2>Chào mừng bạn đến với hệ thống học tập!</h2>
            <p>Khám phá và quản lý các khóa học của bạn một cách dễ dàng.</p>
          </div>
        </div>
        <div className="home-courses-header">
          <span className="home-courses-title"><FaBookOpen style={{marginRight:8}}/>Khóa học của bạn</span>
          <span className="home-courses-count">Tổng: {courses.length}</span>
        </div>
        {loading ? (
          <p className="home-loading">Đang tải...</p>
        ) : courses.length === 0 ? (
          <p className="home-empty">Bạn chưa mua khóa học nào.</p>
        ) : (
          <div className="home-course-list">
            {courses.map((course) => (
              <div
                key={course._id}
                className="home-course-card"
              >
                {course.thumbnail && (
                  <img src={course.thumbnail} alt="thumbnail" className="home-course-thumb" />
                )}
                <div className="home-course-info">
                  <h4 className="home-course-title">{course.title}</h4>
                  <p className="home-course-desc">{course.description}</p>
                  <div className="home-course-meta">
                    <button className="btn-learn" onClick={() => handleLearnClick(course._id)}>
                      Vào học
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default StudentHome;
