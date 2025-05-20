const jwt = require('jsonwebtoken');
const StudentAccount = require('../models/student.model');

module.exports.authenticate = async (req, res, next) => {
    try {
        // Lấy token từ header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                message: 'Không tìm thấy token xác thực'
            });
        }

        // Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Tìm học sinh trong database
        const student = await StudentAccount.findById(decoded.id);
        
        if (!student) {
            return res.status(401).json({
                message: 'Không tìm thấy tài khoản học sinh'
            });
        }

        // Kiểm tra token có khớp với token trong database không
        if (student.token !== token) {
            return res.status(401).json({
                message: 'Token không hợp lệ'
            });
        }

        // Thêm thông tin học sinh vào request
        req.student = student;
        next();
    } catch (error) {
        console.error('Lỗi xác thực:', error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token không hợp lệ hoặc đã hết hạn'
            });
        }
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
}; 