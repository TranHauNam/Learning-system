import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { studentService } from '../../services/student.service';
import StudentHeader from './StudentHeader';
import './StudentLearnPage.css';

const StudentLearnPage = () => {
  const { courseId } = useParams();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeLecture, setActiveLecture] = useState(0);

  useEffect(() => {
    const fetchLectures = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await studentService.getLectures(courseId);
        setLectures(Array.isArray(res.lectures) ? res.lectures : []);
      } catch (err) {
        console.log(err);
        setError('Không thể tải danh sách bài giảng.');
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, [courseId]);

  return (
    <>
      <StudentHeader />
      <div className="learn-main">
        <div className="learn-title">Học bài - Danh sách bài giảng</div>
        {loading && <div>Đang tải...</div>}
        {error && <div style={{color:'red'}}>{error}</div>}
        {!loading && lectures.length === 0 && <div>Chưa có bài giảng nào.</div>}
        <div className="learn-layout">
          {/* Danh sách bài giảng bên trái */}
          <div className="learn-lectures-list">
            <div className="learn-lectures-list-title">Danh sách bài giảng</div>
            <ul>
              {lectures.map((lecture, idx) => (
                <li
                  key={idx}
                  className={
                    'learn-lecture-item' + (idx === activeLecture ? ' active' : '')
                  }
                  onClick={() => setActiveLecture(idx)}
                >
                  {lecture.title}
                </li>
              ))}
            </ul>
          </div>
          {/* Nội dung bài giảng bên phải */}
          <div className="learn-lecture-content">
            {lectures[activeLecture] && (
              <>
                {lectures[activeLecture].video && (
                  <div style={{display:'flex', justifyContent:'center', marginBottom:16}}>
                    <video
                      style={{borderRadius:8, background:'#000', width:'100%', maxWidth:720, height:'auto'}}
                      controls
                    >
                      <source src={lectures[activeLecture].video} type="video/mp4" />
                      Trình duyệt của bạn không hỗ trợ video.
                    </video>
                  </div>
                )}
                {lectures[activeLecture].documents && lectures[activeLecture].documents.length > 0 && (
                  <div style={{marginTop:16}}>
                    <div className="learn-docs-title">Tài liệu:</div>
                    <ul>
                      {lectures[activeLecture].documents.map((doc, i) => (
                        <li key={i}>
                          <a href={doc} target="_blank" rel="noopener noreferrer">
                            Tài liệu {i+1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentLearnPage; 