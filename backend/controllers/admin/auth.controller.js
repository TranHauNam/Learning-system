const AdminAccount = require('../../models/admin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.login = async (req, res) => {
    const {email, password} = req.body;

    const adminAccount = await AdminAccount.findOne({
        email: email
    });

    try {
        if (!adminAccount) {
            return res.status(400).json({
                message: 'Tài khoản không tồn tại'
            });
        }
    
        const isMatch = await bcrypt.compare(password, adminAccount.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Mật khẩu không chính xác"
            })
        }

        const token = jwt.sign(
            { id: adminAccount._id,email: adminAccount.email }, 
            process.env.JWT_SECRET, 
            {expiresIn: '7d'}
        );

        res.status(200).json({
            message: "Đăng nhập thành công",
            token: token
        })
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        })
    }
};

module.exports.logout = (req, res) => {
    return res.status(200).json({
        message: "Đã đăng xuất"
    })
};