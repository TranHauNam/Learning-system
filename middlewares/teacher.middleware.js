const jwt = require('jsonwebtoken');
const TeacherAccount = require('../models/teacher-account.model');

module.exports.authenticate = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                code: 401,
                message: 'Không tìm thấy token xác thực'
            });
        }

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            return res.status(400).json({
                message: 'Token không hợp lệ'
            });
        }

        const teacher = await TeacherAccount.findById(decoded.id).select('-password');
        if (!teacher) {
            return res.status(404).json({
                message: 'Giáo viên không tồn tại'
            });
        }

        req.teacher = teacher;
        next();
    } catch (error) {
        console.error('Lỗi xác thực:', error);
        return res.status(401).json({
            code: 401,
            message: 'Xác thực không thành công'
        });
    }
};
