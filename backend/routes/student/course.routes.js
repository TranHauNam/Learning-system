const express = require('express');
const router = express.Router();
const controller = require('../../controllers/student/course.controller');
const middleware = require('../../middlewares/student.middleware');

router.get('/search', controller.searchCourses);
router.post('/cart', middleware.authenticate, controller.addToCart);
router.post('/checkout', middleware.authenticate, controller.checkoutCart);
router.get('/purchased-courses', middleware.authenticate, controller.getPurchasedCourses);
router.get('/cart', middleware.authenticate, controller.getCart);
router.get('/:courseId', controller.getCourseDetail);
router.get('/:courseId/lectures', controller.getLectures);

module.exports = router; 