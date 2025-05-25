import axios from 'axios';
import { API_URL } from '../constants/config';

const STUDENT_API_URL = `${API_URL}/api/student`;

const axiosInstance = axios.create({
  baseURL: STUDENT_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm interceptor để tự động thêm token vào header nếu có
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Tìm kiếm khóa học
const searchCourses = async (params) => {
  console.log('Gửi request searchCourses với params:', params);
  try {
    const res = await axiosInstance.get('/course/search', { params });
    return res.data;
  } catch (error) {
    console.error('Search Courses Error:', error);
    throw error;
  }
};

// Thêm khóa học vào giỏ hàng
const addToCart = async (courseId) => {
  try {
    const res = await axiosInstance.post('/course/cart', { courseId });
    return res.data;
  } catch (error) {
    console.error('Add To Cart Error:', error);
    throw error;
  }
};

// Thanh toán giỏ hàng
const checkoutCart = async () => {
  try {
    const res = await axiosInstance.post('/course/checkout');
    return res.data;
  } catch (error) {
    console.error('Checkout Cart Error:', error);
    throw error;
  }
};

// Lấy danh sách khóa học đã mua
const getPurchasedCourses = async () => {
  try {
    const res = await axiosInstance.get('/course/purchased-courses');
    return res.data;
  } catch (error) {
    console.error('Get Purchased Courses Error:', error);
    throw error;
  }
};

// Lấy chi tiết khóa học
const getCourseDetail = async (courseId) => {
  try {
    const res = await axiosInstance.get(`/course/${courseId}`);
    return res.data;
  } catch (error) {
    console.error('Get Course Detail Error:', error);
    throw error;
  }
};

// Lấy giỏ hàng
const getCart = async () => {
  try {
    const res = await axiosInstance.get('/course/cart');
    return res.data;
  } catch (error) {
    console.error('Get Cart Error:', error);
    throw error;
  }
};

// Lấy danh sách bài giảng của một khóa học
const getLectures = async (courseId) => {
  try {
    const res = await axiosInstance.get(`/course/${courseId}/lectures`);
    return res.data;
  } catch (error) {
    console.error('Get Lectures Error:', error);
    throw error;
  }
};

export const studentService = {
  searchCourses,
  addToCart,
  checkoutCart,
  getPurchasedCourses,
  getCourseDetail,
  getCart,
  getLectures
}; 