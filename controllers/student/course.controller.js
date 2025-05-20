const Course = require('../../models/course.model');
const Teacher = require('../../models/teacher.model');
const Cart = require('../../models/cart.model');
const Student = require('../../models/student.model');
const path = require('path');

// Tìm kiếm khóa học
module.exports.searchCourses = async (req, res) => {
    try {
        const { keyword, category, teacherId, page = 1, limit = 10 } = req.query;
        
        const query = {};
        
        // Tìm kiếm theo từ khóa
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }
        
        // Lọc theo danh mục
        if (category) {
            query.category = category;
        }
        
        // Lọc theo giáo viên
        if (teacherId) {
            query.teacher = teacherId;
        }

        const courses = await Course.find(query)
            .populate('teacher', 'name email')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Course.countDocuments(query);

        return res.status(200).json({
            message: 'Tìm kiếm khóa học thành công',
            data: {
                courses,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Lỗi tìm kiếm khóa học:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};

// Lọc và sắp xếp khóa học
module.exports.filterAndSortCourses = async (req, res) => {
    try {
        const { 
            minPrice, 
            maxPrice, 
            minRating,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            page = 1, 
            limit = 10 
        } = req.query;

        const query = {};
        
        // Lọc theo giá
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        // Lọc theo đánh giá
        if (minRating) {
            query.rating = { $gte: parseFloat(minRating) };
        }

        // Xác định trường sắp xếp
        let sortField = 'createdAt';
        if (sortBy === 'price') sortField = 'price';
        if (sortBy === 'rating') sortField = 'rating';
        if (sortBy === 'purchases') sortField = 'purchaseCount';

        const sortOptions = {};
        sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;

        const courses = await Course.find(query)
            .populate('teacher', 'name email')
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Course.countDocuments(query);

        return res.status(200).json({
            message: 'Lọc và sắp xếp khóa học thành công',
            data: {
                courses,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Lỗi lọc và sắp xếp khóa học:', error);
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
            .populate('teacher', 'name email avatar')
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
        const studentId = req.user.id;

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
        const studentId = req.user.id;

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

module.exports.downloadFile = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { courseId } = req.params;
        const { fileUrl } = req.query;

        // Kiểm tra học viên đã mua khóa học chưa
        const student = await Student.findById(studentId);
        if (!student.purchasedCourses.includes(courseId)) {
            return res.status(403).json({ message: 'Bạn chưa mua khóa học này' });
        }

        // Kiểm tra fileUrl có thuộc khóa học không (bảo mật)
        const course = await Course.findById(courseId);
        let isValid = false;
        // Kiểm tra trong chapters.lessons
        course.chapters.forEach(chapter => {
            chapter.lessons.forEach(lesson => {
                if (lesson.videoUrl === fileUrl || lesson.documentUrl === fileUrl) {
                    isValid = true;
                }
            });
        });
        // Kiểm tra trong documents (nếu có)
        if (course.documents && Array.isArray(course.documents)) {
            course.documents.forEach(doc => {
                if (doc.url === fileUrl) isValid = true;
            });
        }
        if (!isValid) {
            return res.status(403).json({ message: 'File không thuộc khóa học này' });
        }

        // Trả file về cho client (giả sử fileUrl là đường dẫn trên server)
        const filePath = path.join(__dirname, '../../uploads', fileUrl);
        return res.download(filePath);
    } catch (error) {
        console.error('Lỗi tải file:', error);
        return res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}; 