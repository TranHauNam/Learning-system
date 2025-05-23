const express = require('express');
const router = express.Router();
const controller = require('../../controllers/teacher/course.controller');
const middleware = require('../../middlewares/teacher.middleware');
//const upload = require('../../utils/multer');

// Áp dụng middleware xác thực cho tất cả các route
router.use(middleware.authenticate);


// Quản lý khóa học
router.get('/', controller.getCourses);
router.get('/:id', controller.getCourse);
router.post('/', controller.createCourse);
router.patch('/:id', controller.updateCourse);
router.delete('/:id', controller.deleteCourse);

// Quản lý bài giảng
// router.post(
//     '/:id/lectures', 
//     upload.fields([
//         { name: "video", maxCount: 1 },    // upload 1 file video
//         { name: "documents", maxCount: 10 }, // upload nhiều file tài liệu
//         // Để nhận file đính kèm cho nhiều assignment, có thể nhận tối đa 10 assignment, mỗi assignment tối đa 10 file
//         ...Array.from({length: 10}).map((_, i) => ({ name: `assignments[${i}][attachments]`, maxCount: 10 }))
//     ]), 
//     controller.addLecture
// );
router.post('/:id/lectures', controller.addLecture);
router.patch('/:courseId/lectures/:lectureId', controller.updateLecture);
router.delete('/:courseId/lectures/:lectureId', controller.deleteLecture);

module.exports = router; 