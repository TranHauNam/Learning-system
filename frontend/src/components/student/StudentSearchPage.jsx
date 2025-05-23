import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StudentHeader from './StudentHeader';
import { studentService } from '../../services/student.service';
import './StudentSearchPage.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const StudentSearchPage = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery();

  // Kiểm tra đăng nhập
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    // Có thể kiểm tra role nếu muốn
  }, [navigate]);

  // Lấy kết quả tìm kiếm
  useEffect(() => {
    const keyword = query.get('keyword');
    if (keyword) {
      setSearchLoading(true);
      setSearchError('');
      studentService.searchCourses({ keyword })
        .then(res => setSearchResults(Array.isArray(res.data) ? res.data : []))
        .catch(() => {
          setSearchError('Không tìm thấy kết quả hoặc có lỗi xảy ra.');
          setSearchResults([]);
        })
        .finally(() => setSearchLoading(false));
    } else {
      setSearchResults(null);
      setSearchError('');
      setSearchLoading(false);
    }
    // eslint-disable-next-line
  }, [location.search]);

  const handleCardClick = (courseId) => {
    navigate(`/student/course/${courseId}`);
  };

  return (
    <>
      <StudentHeader onSearchCourses={keyword => navigate(`/student/search?keyword=${encodeURIComponent(keyword)}`)} />
      <div className="dashboard-search-result">
        <h2>Kết quả tìm kiếm</h2>
        {searchLoading && <p>Đang tìm kiếm...</p>}
        {searchError && <p style={{color:'red'}}>{searchError}</p>}
        {(!searchLoading && searchResults && searchResults.length === 0) && <p>Không có kết quả phù hợp.</p>}
        <div style={{display:'flex',flexWrap:'wrap',gap:'24px',marginTop:24}}>
          {searchResults && searchResults.map((course, idx) => (
            <div
              key={course._id || idx}
              className="course-card"
              onClick={() => handleCardClick(course._id)}
              style={{
                cursor: 'pointer',
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                padding: 20,
                width: 280,
                transition: 'box-shadow 0.2s',
                border: '1.5px solid #e0e7ef',
                display: 'flex',
                flexDirection: 'column',
                gap: 10
              }}
            >
              {course.thumbnail && (
                <img src={course.thumbnail} alt="thumbnail" style={{width:'100%',height:120,objectFit:'cover',borderRadius:8,marginBottom:8,border:'1.5px solid #e0e7ef'}} />
              )}
              <div style={{fontWeight:'bold',fontSize:18,marginBottom:4}}>{course.title}</div>
              <div style={{color:'#555',fontSize:15,marginBottom:8}}>{course.description}</div>
              <div style={{fontSize:14,color:'#2563eb',marginBottom:4}}>Giá: {course.price?.toLocaleString()}đ</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StudentSearchPage; 