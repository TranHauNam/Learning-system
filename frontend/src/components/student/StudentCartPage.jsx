import React, { useEffect, useState, useContext } from 'react';
import { studentService } from '../../services/student.service';
import StudentHeader from './StudentHeader';
import './StudentCartPage.css';
import { CartContext } from '../common/cartContext.jsx';
import { useNavigate } from 'react-router-dom';

const StudentCartPage = () => {
  const [cartCourses, setCartCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMsg, setCheckoutMsg] = useState('');
  const { setCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await studentService.getCart();
      setCartCourses(res.data || []);
    } catch {
      setError('Không thể tải giỏ hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutMsg('');
    try {
      const res = await studentService.checkoutCart();
      setCheckoutMsg(res.message || 'Thanh toán thành công!');
      await fetchCart();
      setCartCount(0); // Reset số lượng giỏ hàng về 0
      // Điều hướng sang home sau khi mua thành công
      setTimeout(() => {
        navigate('/student/home');
      }, 1200);
    } catch {
      setCheckoutMsg('Thanh toán thất bại!');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Tính tổng tiền
  const total = cartCourses.reduce((sum, c) => sum + (c.price || 0), 0);

  return (
    <>
      <StudentHeader />
      <div className="cart-page-container">
        <h2>Giỏ hàng của bạn</h2>
        {loading && <div>Đang tải...</div>}
        {error && <div style={{color:'red'}}>{error}</div>}
        {!loading && cartCourses.length === 0 && <div>Giỏ hàng trống.</div>}
        <div>
          {cartCourses.map(course => (
            <div key={course._id} className="cart-item">
              <img src={course.thumbnail} alt="thumbnail" />
              <div style={{flex:1}}>
                <div className="cart-item-title">{course.title}</div>
                <div className="cart-item-desc">{course.description}</div>
                <div className="cart-item-price">Giá: {course.price?.toLocaleString()}đ</div>
              </div>
              <div className="cart-item-teacher">
                GV: {course.teacher?.surname || ''} {course.teacher?.middleName || ''}
              </div>
            </div>
          ))}
        </div>
        {/* Tổng tiền */}
        {!loading && cartCourses.length > 0 && (
          <div className="cart-total">Tổng tiền: {total.toLocaleString()}đ</div>
        )}
        {/* Nút mua hàng */}
        {!loading && cartCourses.length > 0 && (
          <div style={{marginTop:16, textAlign:'right'}}>
            <button className="btn-pay-now" onClick={handleCheckout} disabled={checkoutLoading}>
              {checkoutLoading ? 'Đang thanh toán...' : 'Mua hàng'}
            </button>
          </div>
        )}
        {checkoutMsg && <div style={{marginTop:18, color: checkoutMsg.includes('thành công') ? 'green' : 'red'}}>{checkoutMsg}</div>}
      </div>
    </>
  );
};

export default StudentCartPage; 