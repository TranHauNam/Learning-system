const express = require('express');
const router = express.Router();
const controller = require('../../controllers/student/course.controller');
const middleware = require('../../middlewares/student.middleware');

// Tìm kiếm khóa học
router.get('/search', controller.searchCourses);

// Lọc và sắp xếp khóa học
router.get('/filter', controller.filterAndSortCourses);

// Xem chi tiết khóa học
router.get('/:courseId', controller.getCourseDetail);

// Thêm khóa học vào giỏ hàng (yêu cầu đăng nhập)
router.post('/cart', middleware.authenticate, controller.addToCart);

// Thanh toán giỏ hàng (mô phỏng)
router.post('/checkout', middleware.authenticate, controller.checkoutCart);

router.get('/:id/download', middleware.authenticate, controller.downloadFile);

module.exports = router; 