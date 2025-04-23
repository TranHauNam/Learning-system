const express = require('express');
const router = express.Router();
const middleware = require('../../middlewares/teacher.middleware');
const controller = require('../../controllers/teacher/auth.controller');

router.post('/register', controller.register);
router.post('/verify-otp', controller.verifyOtp);
router.post('/create-account', controller.createAccount);
router.post('/complete-profile', middleware.authenticate, controller.completeTeacherProfile);
router.post('/login', controller.login);
router.post('/forgot-password', controller.forgotPassword);
router.post('/verify-reset-password-otp', controller.verifyResetPasswordOtp);
router.post('/reset-password', controller.resetPassword);
router.post('/change-password', middleware.authenticate, controller.changePassword);
router.post('/logout', middleware.authenticate, controller.logout);

module.exports = router; 