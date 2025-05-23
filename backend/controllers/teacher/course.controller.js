const Course = require('../../models/course.model');
const qs = require('qs');

// Lấy danh sách khóa học của giáo viên
module.exports.getCourses = async (req, res) => {
    try {
        const teacherId = req.teacher._id;
        const { status } = req.query;

        const query = {
            teacher: teacherId,
            deleted: false
        };

        if (status) {
            query.status = status;
        }

        const courses = await Course.find(query)
            .select('title description category price thumbnail status rating enrolledStudents')
            .populate('category', 'name')
            .lean();

        // Thêm số học sinh đang theo học vào từng khóa học
        const coursesWithStudentCount = courses.map(course => ({
            ...course,
            studentCount: course.enrolledStudents?.length || 0
        }));

        return res.status(200).json({
            message: 'Lấy danh sách khóa học thành công',
            data: coursesWithStudentCount
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách khóa học:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};

// Lấy chi tiết khóa học
module.exports.getCourse = async (req, res) => {
    try {
        const teacherId = req.teacher._id;
        const courseId = req.params.id;

        const course = await Course.findOne({
            _id: courseId,
            teacher: teacherId,
            deleted: false
        })
        .populate('category', 'name')
        .lean();

        if (!course) {
            return res.status(404).json({
                message: 'Không tìm thấy khóa học'
            });
        }

        return res.status(200).json({
            message: 'Lấy thông tin khóa học thành công',
            data: course
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin khóa học:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};

// Tạo khóa học mới
module.exports.createCourse = async (req, res) => {
    try {
        const teacherId = req.teacher._id;
        const {
            title,
            description,
            category,
            price,
            thumbnail
        } = req.body;

        const newCourse = new Course({
            title,
            description,
            category,
            price,
            thumbnail,
            teacher: teacherId
        });

        await newCourse.save();

        return res.status(201).json({
            message: 'Tạo khóa học thành công',
            data: newCourse
        });
    } catch (error) {
        console.error('Lỗi khi tạo khóa học:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};

// Cập nhật thông tin khóa học
module.exports.updateCourse = async (req, res) => {
    try {
        const teacherId = req.teacher._id;
        const courseId = req.params.id;
        const updateData = req.body;

        const course = await Course.findOne({
            _id: courseId,
            teacher: teacherId,
            deleted: false
        });

        if (!course) {
            return res.status(404).json({
                message: 'Không tìm thấy khóa học'
            });
        }

        // Chỉ cho phép cập nhật các trường cơ bản
        const allowedFields = ['title', 'description', 'category', 'price', 'thumbnail', 'status'];
        Object.keys(updateData).forEach(key => {
            if (!allowedFields.includes(key)) {
                delete updateData[key];
            }
        });

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            updateData,
            { new: true }
        )
        .populate('category', 'name');

        return res.status(200).json({
            message: 'Cập nhật khóa học thành công',
            data: updatedCourse
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật khóa học:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};

// Xóa khóa học
module.exports.deleteCourse = async (req, res) => {
    try {
        const teacherId = req.teacher._id;
        const courseId = req.params.id;

        const course = await Course.findOne({
            _id: courseId,
            teacher: teacherId,
            deleted: false
        });

        if (!course) {
            return res.status(404).json({
                message: 'Không tìm thấy khóa học'
            });
        }

        // Soft delete
        course.deleted = true;
        course.deletedAt = new Date();
        await course.save();

        return res.status(200).json({
            message: 'Xóa khóa học thành công'
        });
    } catch (error) {
        console.error('Lỗi khi xóa khóa học:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};

// Thêm bài giảng mới vào khóa học
module.exports.addLecture = async (req, res) => {
    try {
        const teacherId = req.teacher._id;
        const courseId = req.params.id;
        const lectureData = req.body;

        const course = await Course.findOne({
            _id: courseId,
            teacher: teacherId,
            deleted: false
        });

        if (!course) {
            return res.status(404).json({
                message: 'Không tìm thấy khóa học'
            });
        }

        course.lectures.push(lectureData);
        await course.save();

        return res.status(201).json({
            message: 'Thêm bài giảng thành công',
            data: course.lectures[course.lectures.length - 1]
        });
    } catch (error) {
        console.error('Lỗi khi thêm bài giảng:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};


// Cập nhật bài giảng
module.exports.updateLecture = async (req, res) => {
    try {
        const teacherId = req.teacher._id;
        const { courseId, lectureId } = req.params;
        const updateData = req.body;

        const course = await Course.findOne({
            _id: courseId,
            teacher: teacherId,
            deleted: false
        });

        if (!course) {
            return res.status(404).json({
                message: 'Không tìm thấy khóa học'
            });
        }

        const lecture = course.lectures.id(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: 'Không tìm thấy bài giảng'
            });
        }

        Object.assign(lecture, updateData);
        await course.save();

        return res.status(200).json({
            message: 'Cập nhật bài giảng thành công',
            data: lecture
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật bài giảng:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};

// Xóa bài giảng
module.exports.deleteLecture = async (req, res) => {
    try {
        const teacherId = req.teacher._id;
        const { courseId, lectureId } = req.params;

        const course = await Course.findOne({
            _id: courseId,
            teacher: teacherId,
            deleted: false
        });

        if (!course) {
            return res.status(404).json({
                message: 'Không tìm thấy khóa học'
            });
        }

        const lectureIndex = course.lectures.findIndex(
            lecture => lecture._id.toString() === lectureId
        );

        if (lectureIndex === -1) {
            return res.status(404).json({
                message: 'Không tìm thấy bài giảng'
            });
        }

        course.lectures.splice(lectureIndex, 1);
        await course.save();

        return res.status(200).json({
            message: 'Xóa bài giảng thành công'
        });
    } catch (error) {
        console.error('Lỗi khi xóa bài giảng:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
}; 