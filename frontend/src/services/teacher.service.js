import axios from 'axios';
import { API_URL } from '../constants/config';

const TEACHER_API_URL = `${API_URL}/api/teacher`;

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: TEACHER_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm interceptor để tự động thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    console.log('Request:', config);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Thêm interceptor để log response
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);

const getTeacherProfile = async () => {
  try {
    const response = await axiosInstance.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Get Profile Error:', error);
    throw error;
  }
};

const updateProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put('/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Update Profile Error:', error);
    throw error;
  }
};

const updateAddress = async (addressData) => {
  try {
    const response = await axiosInstance.put('/profile/address', addressData);
    return response.data;
  } catch (error) {
    console.error('Update Address Error:', error);
    throw error;
  }
};

const addCourse = async (courseData) => {
  try {
    const response = await axiosInstance.post('/courses', courseData);
    return response.data;
  } catch (error) {
    console.error('Add Course Error:', error);
    throw error;
  }
};

const getCourses = async (params) => {
  try {
    const response = await axiosInstance.get('/courses', { params });
    return { data: response.data.data };
  } catch (error) {
    console.error('Get Courses Error:', error);
    throw error;
  }
};

const getCourse = async (id) => {
  try {
    const response = await axiosInstance.get(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get Course Error:', error);
    throw error;
  }
};

const updateCourse = async (id, updateData) => {
  try {
    const response = await axiosInstance.patch(`/courses/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Update Course Error:', error);
    throw error;
  }
};

const deleteCourse = async (id) => {
  try {
    const response = await axiosInstance.delete(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete Course Error:', error);
    throw error;
  }
};

const addLecture = async (courseId, lectureData) => {
  try {
    const response = await axiosInstance.post(`/courses/${courseId}/lectures`, lectureData);
    return response.data;
  } catch (error) {
    console.error('Add Lecture Error:', error);
    throw error;
  }
};

export const teacherService = {
  getTeacherProfile,
  updateProfile,
  updateAddress,
  addCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  addLecture
}; 