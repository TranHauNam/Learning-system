const Course = require('../../models/course.model');
const Teacher = require('../../models/teacher.model');
const Cart = require('../../models/cart.model');
const Student = require('../../models/student.model');
const path = require('path');
const { time } = require('console');

// Tìm kiếm khóa học
module.exports.searchCourses = async (req, res) => {
    try {
        const { keyword } = req.query;
        const query = {};
        // Tìm kiếm theo từ khóa (chỉ theo tên khóa học)
        if (keyword) {
            query.title = { $regex: keyword, $options: 'i' };
        }

        const courses = await Course.find(query)
            .populate('teacher', 'name email')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'Tìm kiếm khóa học thành công',
            data: courses
        });
    } catch (error) {
        console.error('Lỗi tìm kiếm khóa học:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};

// Xem chi tiết khóa học
module.exports.getCourseDetail = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId)
            .populate('teacher', 'surname middleName phone email avatar')
            .populate('category', 'name');

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
        console.error('Lỗi xem chi tiết khóa học:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};

// Thêm khóa học vào giỏ hàng
module.exports.addToCart = async (req, res) => {
    try {
        const { courseId } = req.body;
        const studentId = req.student.id;

        // Kiểm tra khóa học tồn tại
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: 'Không tìm thấy khóa học'
            });
        }

        // Kiểm tra xem khóa học đã có trong giỏ hàng chưa
        let cart = await Cart.findOne({ student: studentId });
        
        if (!cart) {
            // Tạo giỏ hàng mới nếu chưa có
            cart = new Cart({
                student: studentId,
                courses: [courseId]
            });
        } else {
            // Kiểm tra xem khóa học đã có trong giỏ hàng chưa
            if (cart.courses.includes(courseId)) {
                return res.status(400).json({
                    message: 'Khóa học đã có trong giỏ hàng'
                });
            }
            cart.courses.push(courseId);
        }

        await cart.save();

        return res.status(200).json({
            message: 'Thêm khóa học vào giỏ hàng thành công',
            data: cart
        });
    } catch (error) {
        console.error('Lỗi thêm vào giỏ hàng:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};

// Thanh toán giỏ hàng (mô phỏng)
module.exports.checkoutCart = async (req, res) => {
    try {
        const studentId = req.student.id;

        // Lấy giỏ hàng của học viên
        const cart = await Cart.findOne({ student: studentId });
        if (!cart || cart.courses.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng trống, không thể thanh toán' });
        }

        // Lấy thông tin học viên
        const student = await Student.findById(studentId);

        // Thêm các khóa học trong giỏ hàng vào danh sách đã mua (nếu chưa có)
        cart.courses.forEach(courseId => {
            if (!student.purchasedCourses.includes(courseId)) {
                student.purchasedCourses.push(courseId);
            }
        });

        await student.save();

        // Xóa giỏ hàng sau khi thanh toán
        cart.courses = [];
        cart.totalAmount = 0;
        await cart.save();

        return res.status(200).json({
            message: 'Thanh toán thành công! Các khóa học đã được thêm vào tài khoản của bạn.',
            data: {
                purchasedCourses: student.purchasedCourses
            }
        });
    } catch (error) {
        console.error('Lỗi thanh toán giỏ hàng:', error);
        return res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Lấy tất cả các khóa học đã mua của học viên
module.exports.getPurchasedCourses = async (req, res) => {
    try {
        const studentId = req.student.id;
        const student = await Student.findById(studentId).populate({
            path: 'purchasedCourses',
            populate: [
                { path: 'teacher', select: 'name email' },
                { path: 'category', select: 'name' }
            ]
        });
        if (!student) {
            return res.status(404).json({ message: 'Không tìm thấy học viên' });
        }
        return res.status(200).json({
            message: 'Lấy danh sách khóa học đã mua thành công',
            data: student.purchasedCourses
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách khóa học đã mua:', error);
        return res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}; 