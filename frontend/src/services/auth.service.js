import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm interceptor để log request
axiosInstance.interceptors.request.use(
  (config) => {
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

const register = async (email, password, reenterPassword, role) => {
  try {
    const response = await axiosInstance.post('/register', {
      email,
      password,
      reenterPassword,
      role
    });
    return response.data;
  } catch (error) {
    console.error('Register Error:', error);
    throw error;
  }
};

const verifyOtp = async (otp) => {
  try {
    const response = await axiosInstance.post('/verify-otp', { otp });
    return response.data;
  } catch (error) {
    console.error('Verify OTP Error:', error);
    throw error;
  }
};

const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/login', {
      email,
      password
    });
    console.log(response.data);
    if (response.data.data?.token) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
};

const logout = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      await axiosInstance.post('/logout', {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
    }
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
};

const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post('/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Forgot Password Error:', error);
    throw error;
  }
};

const verifyResetPasswordOtp = async (otp) => {
  try {
    const response = await axiosInstance.post('/verify-reset-password-otp', { otp });
    return response.data;
  } catch (error) {
    console.error('Verify Reset Password OTP Error:', error);
    throw error;
  }
};

const resetPassword = async (resetToken, newPassword, reenterNewPassword) => {
  try {
    const response = await axiosInstance.post('/reset-password', {
      resetToken,
      newPassword,
      reenterNewPassword
    });
    return response.data;
  } catch (error) {
    console.error('Reset Password Error:', error);
    throw error;
  }
};

const completeProfile = async (userData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axiosInstance.put('/complete-profile', userData, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Complete Profile Error:', error);
    throw error;
  }
};

const changePassword = async (currentPassword, newPassword, reenterNewPassword) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axiosInstance.put('/change-password', {
      currentPassword,
      newPassword,
      reenterNewPassword
    }, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Change Password Error:', error);
    throw error;
  }
};

export const authService = {
  register,
  verifyOtp,
  login,
  logout,
  forgotPassword,
  verifyResetPasswordOtp,
  resetPassword,
  completeProfile,
  changePassword
}; 