const jwt = require('jsonwebtoken');
const StudentAccount = require('../models/student.model');
const TeacherAccount = require('../models/teacher.model');

module.exports.authenticate = async (req, res, next) => {
    try {
        // Lấy token từ header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Không tìm thấy token xác thực'
            });
        }

        const token = authHeader.split(' ')[1];

        // Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id || !decoded.role) {
            return res.status(401).json({
                message: 'Token không hợp lệ'
            });
        }

        // Tìm user trong model tương ứng
        let user;
        if (decoded.role === 'student') {
            user = await StudentAccount.findById(decoded.id);
        } else if (decoded.role === 'teacher') {
            user = await TeacherAccount.findById(decoded.id);
        }

        if (!user) {
            return res.status(401).json({
                message: 'Không tìm thấy người dùng'
            });
        }

        // Kiểm tra token có khớp với token trong database không
        if (user.token !== token) {
            return res.status(401).json({
                message: 'Token đã hết hạn hoặc không hợp lệ'
            });
        }

        // Thêm thông tin user vào request
        req.user = {
            id: user._id,
            email: user.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        console.error('Lỗi xác thực:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Token không hợp lệ'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token đã hết hạn'
            });
        }
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};

// Middleware kiểm tra role
module.exports.checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'Vui lòng đăng nhập'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Không có quyền truy cập'
            });
        }

        next();
    };
}; 