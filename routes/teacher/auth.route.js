const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/teacher.middleware');
const controller = require('../../controllers/teacher/auth.controller');

// Auth routes
router.post('/register', controller.register);
router.post('/verify-otp', controller.verifyOtp);
router.post('/create-account', controller.createAccount);
router.post('/complete-profile', authenticate, controller.completeTeacherProfile);
router.post('/login', controller.login);
router.post('/forgot-password', controller.forgotPassword);
router.post('/verify-reset-password-otp', controller.verifyResetPasswordOtp);
router.post('/reset-password', controller.resetPassword);
router.post('/change-password', authenticate, controller.changePassword);
router.post('/logout', authenticate, controller.logout);

module.exports = router; 