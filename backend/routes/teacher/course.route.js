const express = require('express');
const router = express.Router();
const controller = require('../../controllers/teacher/course.controller');
const middleware = require('../../middlewares/teacher.middleware');

// Áp dụng middleware xác thực cho tất cả các route
router.use(middleware.authenticate);


// Quản lý khóa học
router.get('/', controller.getCourses);
router.get('/:id', controller.getCourse);
router.post('/', controller.createCourse);
router.patch('/:id', controller.updateCourse);
router.delete('/:id', controller.deleteCourse);

// Quản lý bài giảng
router.post('/:id/lectures', controller.addLecture);
router.patch('/:courseId/lectures/:lectureId', controller.updateLecture);
router.delete('/:courseId/lectures/:lectureId', controller.deleteLecture);

module.exports = router; 