const express = require('express');
const router = express.Router();
const controller = require('../../controllers/common/auth.controller');
const middleware = require('../../middlewares/auth.middleware');

// Đăng ký và xác thực OTP
router.post('/register', controller.register);
router.post('/verify-otp', controller.verifyOtp);

// Đăng nhập và đăng xuất
router.post('/login', controller.login);
router.post('/logout', middleware.authenticate, controller.logout);

// Quên mật khẩu và đặt lại mật khẩu
router.post('/forgot-password', controller.forgotPassword);
router.post('/verify-reset-password-otp', controller.verifyResetPasswordOtp);
router.post('/reset-password', controller.resetPassword);

// Cập nhật thông tin và đổi mật khẩu (yêu cầu đăng nhập)
router.put('/complete-profile', middleware.authenticate, controller.completeProfile);
router.put('/change-password', middleware.authenticate, controller.changePassword);

module.exports = router; 