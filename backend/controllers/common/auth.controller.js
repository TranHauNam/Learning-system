const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../../models/student.model');
const Teacher = require('../../models/teacher.model');
const OTP = require('../../models/otp.model');
const generateOtp = require('../../utils/generateOtp');
const sendMail = require('../../utils/sendMail');

// Đăng ký
module.exports.register = async (req, res) => {
    try {
        const { email, password, reenterPassword, role } = req.body;

        // Kiểm tra role hợp lệ
        if (!['student', 'teacher'].includes(role)) {
            return res.status(400).json({
                message: 'Role không hợp lệ'
            });
        }

        // Kiểm tra email đã tồn tại chưa
        let existingUser;
        if (role === 'student') {
            existingUser = await Student.findOne({ email });
        } else {
            existingUser = await Teacher.findOne({ email });
        }

        if (existingUser) {
            return res.status(400).json({
                message: 'Email đã được sử dụng'
            });
        }

        if (password !== reenterPassword) {
            return res.status(400).json({
                message: "Xác nhận mật khẩu không chính xác"
            });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = generateOtp();

        await OTP.findOneAndUpdate(
            { email },
            { 
                email, 
                otp: otp, 
                password: hashedPassword,
                role: role
            },
            { upsert: true }
        );
        
        try {
            await sendMail(email, 'Mã OTP xác thực', `<p>Mã OTP của bạn là: <b>${otp}</b></p>`);
        } catch (err) {
            console.error('Lỗi gửi mail:', err);
            return res.status(500).json({ message: 'Lỗi gửi mail' });
        }

        return res.status(200).json({
            message: "Gửi mã OTP thành công",
            otp
        });
    } catch (error) {
        console.error('Lỗi gửi otp', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};

// Xác thực OTP
module.exports.verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
    
        if (!otp) {
            return res.status(400).json({ 
                message: 'Vui lòng nhập mã OTP' 
            });
        }

        const otpStore = await OTP.findOne({ otp }).sort({ createdAt: -1 });
    
        if (!otpStore) {
            return res.status(400).json({ 
                message: 'Mã OTP không chính xác hoặc đã hết hạn' 
            });
        }

        // Tạo tài khoản mới dựa vào role
        let newUser;
        if (otpStore.role === 'student') {
            newUser = new Student({
                email: otpStore.email,
                password: otpStore.password
            });
        } else {
            newUser = new Teacher({
                email: otpStore.email,
                password: otpStore.password
            });
        }

        // Tạo token đăng nhập
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, role: otpStore.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "7d" }
        );

        newUser.token = token;
        await newUser.save();

        // Xóa OTP sau khi đã tạo tài khoản
        await OTP.deleteOne({ email: newUser.email });

        return res.status(201).json({
            message: `Tạo tài khoản ${otpStore.role} thành công`,
            data: {
                id: newUser._id,
                email: newUser.email,
                role: otpStore.role,
                token
            }
        });
    } catch (error) {
        console.error("Lỗi xác thực OTP", error);
        return res.status(500).json({
            message: "Lỗi máy chủ!"
        });
    }
};

// Cập nhật thông tin cá nhân
module.exports.completeProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        const {
            province,
            ward,
            school,
            surname,
            middleName,
            phone,
            gender,
            birthday,
        } = req.body;

        let updated;
        if (role === 'student') {
            updated = await Student.findByIdAndUpdate(
                userId,
                {
                    province,
                    ward,
                    school,
                    surname,
                    middleName,
                    phone,
                    gender,
                    birthday
                },
                { new: true }
            ).select('-password');
        } else {
            updated = await Teacher.findByIdAndUpdate(
                userId,
                {
                    province,
                    ward,
                    school,
                    surname,
                    middleName,
                    phone,
                    gender,
                    birthday
                },
                { new: true }
            ).select('-password');
        }

        if (!updated) {
            return res.status(404).json({
                message: "Không tìm thấy tài khoản"
            });
        }

        return res.status(200).json({ 
            message: "Cập nhật thông tin thành công!", 
            data: updated 
        });
    } catch (error) {
        console.error("Lỗi cập nhật thông tin", error);
        return res.status(500).json({ message: "Lỗi máy chủ!" });
    }
};

// Đăng nhập
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm user trong cả hai model
        const student = await Student.findOne({ email });
        const teacher = await Teacher.findOne({ email });
        const user = student || teacher;

        if (!user) {
            return res.status(400).json({
                message: 'Email hoặc mật khẩu không chính xác'
            });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Mật khẩu không chính xác'
            });
        }

        // Xác định role
        const role = student ? 'student' : 'teacher';

        // Tạo token
        const token = jwt.sign(
            { id: user._id, email: user.email, role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Cập nhật token
        user.token = token;
        await user.save();

        return res.status(200).json({
            message: 'Đăng nhập thành công',
            data: {
                id: user._id,
                email: user.email,
                role,
                token
            }
        });
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};

// Quên mật khẩu
module.exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Kiểm tra email tồn tại trong cả hai model
        const student = await Student.findOne({ email });
        const teacher = await Teacher.findOne({ email });
        const user = student || teacher;

        if (!user) {
            return res.status(404).json({
                message: 'Email không tồn tại trong hệ thống'
            });
        }

        // Tạo OTP
        const otp = generateOtp();

        await OTP.findOneAndUpdate(
            { email },
            { 
                email, 
                otp
            },
            { upsert: true }
        );
        
        await sendMail(email, 'Mã OTP xác thực', `<p>Mã OTP của bạn là: <b>${otp}</b></p>`);

        return res.status(200).json({
            message: 'Mã OTP đã được gửi vào email của bạn'
        });
    } catch (error) {
        console.error('Lỗi quên mật khẩu:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};

// Xác thực OTP để đặt lại mật khẩu
module.exports.verifyResetPasswordOtp = async (req, res) => {
    try {
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({
                message: 'Vui lòng cung cấp mã OTP'
            });
        }

        // Tìm OTP trong cơ sở dữ liệu
        const otpStore = await OTP.findOne({ otp }).sort({ createdAt: -1 });

        if (!otpStore) {
            return res.status(400).json({
                message: 'Mã OTP không chính xác hoặc đã hết hạn'
            });
        }

        // Tạo token tạm thời để đặt lại mật khẩu
        const resetToken = jwt.sign(
            { email: otpStore.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        return res.status(200).json({
            message: 'Xác thực OTP thành công',
            data: {
                email: otpStore.email,
                resetToken
            }
        });
    } catch (error) {
        console.error('Lỗi xác thực OTP đặt lại mật khẩu:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};

// Đặt lại mật khẩu
module.exports.resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword, reenterNewPassword } = req.body;

        if (newPassword !== reenterNewPassword) {
            return res.status(400).json({
                message: "Xác nhận mật khẩu không chính xác"
            })
        }

        // Xác thực token
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        if (!decoded.email) {
            return res.status(400).json({
                message: 'Token không hợp lệ hoặc đã hết hạn'
            });
        }

        // Tìm user trong cả hai model
        const student = await Student.findOne({ email: decoded.email });
        const teacher = await Teacher.findOne({ email: decoded.email });
        const user = student || teacher;

        if (!user) {
            return res.status(404).json({
                message: 'Không tìm thấy tài khoản'
            });
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật mật khẩu
        user.password = hashedPassword;
        await user.save();

        // Xóa OTP đã sử dụng
        await OTP.deleteOne({ email: decoded.email });

        return res.status(200).json({
            message: 'Đặt lại mật khẩu thành công'
        });
    } catch (error) {
        console.error('Lỗi đặt lại mật khẩu:', error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(400).json({
                message: 'Token không hợp lệ hoặc đã hết hạn'
            });
        }
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};

// Đổi mật khẩu (khi đã đăng nhập)
module.exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, reenterNewPassword } = req.body;
        const userId = req.user.id;
        const role = req.user.role;

        if (newPassword !== reenterNewPassword) {
            return res.status(400).json({
                message: "Xác nhận mật khẩu không chính xác"
            })
        }

        // Tìm user trong model tương ứng
        let user;
        if (role === 'student') {
            user = await Student.findById(userId);
        } else {
            user = await Teacher.findById(userId);
        }

        if (!user) {
            return res.status(404).json({
                message: 'Không tìm thấy tài khoản'
            });
        }

        // Kiểm tra mật khẩu hiện tại
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Mật khẩu hiện tại không chính xác'
            });
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật mật khẩu
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            message: 'Đổi mật khẩu thành công'
        });
    } catch (error) {
        console.error('Lỗi đổi mật khẩu:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};

// Đăng xuất
module.exports.logout = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        // Xóa token trong model tương ứng
        if (role === 'student') {
            await Student.findByIdAndUpdate(userId, { token: undefined });
        } else {
            await Teacher.findByIdAndUpdate(userId, { token: undefined });
        }

        return res.status(200).json({
            message: 'Đăng xuất thành công'
        });
    } catch (error) {
        console.error('Lỗi đăng xuất:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
}; 