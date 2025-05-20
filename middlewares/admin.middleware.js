const jwt = require('jsonwebtoken');
const AdminAccount = require('../models/admin.model');

// Xác thực admin bằng token
module.exports.authenticate = async (req, res, next) => {
    try {
        // Kiểm tra header Authorization
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Không tìm thấy token xác thực'
            });
        }

        // Lấy token từ header
        const token = req.headers.authorization.split(' ')[1];
        
        // Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.id) {
            return res.status(401).json({
                message: 'Token không hợp lệ'
            });
        }

        // Tìm admin bằng id từ token và loại trừ mật khẩu
        const admin = await AdminAccount.findById(decoded.id).select('-password');
        if (!admin) {
            return res.status(401).json({
                message: 'Admin không tồn tại'
            });
        }

        // Kiểm tra trạng thái admin
        if (admin.status !== 'active') {
            return res.status(403).json({
                message: 'Tài khoản admin đã bị khóa'
            });
        }

        // Lưu thông tin admin vào request để sử dụng trong các middleware tiếp theo
        req.admin = admin;
        next();
    } catch (error) {
        console.error('Lỗi xác thực admin:', error);
        
        // Xử lý các lỗi liên quan đến token
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

// Kiểm tra quyền admin
module.exports.requireAdmin = (req, res, next) => {
    try {
        // Đảm bảo đã qua middleware authenticate
        if (!req.admin) {
            return res.status(401).json({
                message: 'Không tìm thấy thông tin admin'
            });
        }

        // Kiểm tra quyền admin
        if (req.admin.role !== 'admin' && req.admin.role !== 'super_admin') {
            return res.status(403).json({
                message: 'Bạn không có quyền truy cập tính năng này'
            });
        }

        next();
    } catch (error) {
        console.error('Lỗi kiểm tra quyền admin:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};

// Kiểm tra quyền super admin
module.exports.requireSuperAdmin = (req, res, next) => {
    try {
        // Đảm bảo đã qua middleware authenticate
        if (!req.admin) {
            return res.status(401).json({
                message: 'Không tìm thấy thông tin admin'
            });
        }

        // Kiểm tra quyền super admin
        if (req.admin.role !== 'super_admin') {
            return res.status(403).json({
                message: 'Bạn không có quyền truy cập tính năng này. Yêu cầu quyền Super Admin.'
            });
        }

        next();
    } catch (error) {
        console.error('Lỗi kiểm tra quyền super admin:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};