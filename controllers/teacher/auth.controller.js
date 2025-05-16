const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const TeacherAccount = require('../../models/teacher-account.model');
const OTP = require('../../models/otp.model');
const generateOtp = require('../../utils/generateOtp');
const sendMail = require('../../utils/sendMail');

// Bước 1: Nhập email, password rồi gửi OTP
module.exports.register = async (req, res) => {
    try {
        const { email, password, reenterPassword } = req.body;

        // Kiểm tra email đã tồn tại chưa
        const existingTeacher = await TeacherAccount.findOne({ email });
        if (existingTeacher) {
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
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = generateOtp();

        await OTP.findOneAndUpdate(
            { email },
            { 
                email, 
                otp, 
                password: hashedPassword,
            },
            { upsert: true }
        );
        
        await sendMail(email, 'Mã OTP xác thực', `<p>Mã OTP của bạn là: <b>${otp}</b></p>`);

        return res.status(200).json({
            message: "Gửi mã OTP thành công"
        });
    } catch (error) {
        console.error('Lỗi gửi otp', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};

// Bước 2: Xác thực OTP
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
        
        // Tạo token tạm thời để xác nhận OTP hợp lệ (không tạo tài khoản)
        const tempToken = jwt.sign(
            { email: otpStore.email, password: otpStore.password }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );
        
        return res.status(200).json({
            message: "Xác thực OTP thành công",
            data: {
                email: otpStore.email,
                tempToken
            }
        });
    } catch (error) {
        console.error("Lỗi xác thực OTP", error);
        return res.status(500).json({
            message: "Lỗi máy chủ!"
        });
    }
};

// Bước 3: Chọn loại tài khoản và tạo tài khoản
module.exports.createAccount = async (req, res) => {
    try {
        const { tempToken, accountType } = req.body;

        // Kiểm tra token tạm thời
        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        
        if (!decoded.email) {
            return res.status(401).json({ 
                message: 'Token không hợp lệ' 
            });
        }

        // Kiểm tra loại tài khoản
        if (accountType !== 'teacher' && accountType !== 'student') {
            return res.status(400).json({ 
                message: 'Loại tài khoản không hợp lệ' 
            });
        }

        // Tìm thông tin OTP
        const otpStore = await OTP.findOne({ email: decoded.email });
        if (!otpStore) {
            return res.status(404).json({ 
                message: 'Không tìm thấy thông tin đăng ký' 
            });
        }

        // Tạo tài khoản theo loại
        if (accountType === 'teacher') {
            // Tạo tài khoản giáo viên
            const newTeacher = new TeacherAccount({
                email: decoded.email,
                password: decoded.password
            });

            // Tạo token đăng nhập
            const token = jwt.sign(
                { id: newTeacher._id, email: newTeacher.email }, 
                process.env.JWT_SECRET, 
                { expiresIn: "7d" }
            );

            newTeacher.token = token;
            await newTeacher.save();

            // Xóa OTP sau khi đã tạo tài khoản
            await OTP.deleteOne({ email: decoded.email });

            return res.status(201).json({
                message: "Tạo tài khoản giáo viên thành công",
                data: {
                    id: newTeacher._id,
                    email: newTeacher.email,
                    token,
                    accountType: 'teacher'
                }
            });
        } else {
            // Tạo tài khoản học sinh 
            return res.status(501).json({
                message: "Chức năng tạo tài khoản học sinh đang được phát triển"
            });
        }
    } catch (error) {
        console.error("Lỗi tạo tài khoản", error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token không hợp lệ hoặc đã hết hạn'
            });
        }
        return res.status(500).json({
            message: "Lỗi máy chủ!"
        });
    }
};

// Bước 4: Bổ sung thông tin cá nhân
module.exports.completeTeacherProfile = async (req, res) => {
    try {
        const teacherId = req.teacher._id;
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

        const updated = await TeacherAccount.findByIdAndUpdate(
            teacherId,
            {
                province,
                ward,
                school,
                surname,
                middleName,
                phone,
                gender,
                birthday,
            },
            { new: true }
        ).select('-password');

        if (!updated) {
            return res.status(404).json({
                message: "Không tìm thấy tài khoản giáo viên"
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

        // Kiểm tra email tồn tại
        const teacher = await TeacherAccount.findOne({ email });
        if (!teacher) {
            return res.status(400).json({
                message: 'Email hoặc mật khẩu không chính xác'
            });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Mật khẩu không chính xác'
            });
        }

        // Tạo token
        const token = jwt.sign(
            { id: teacher._id, email: teacher.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Cập nhật token
        teacher.token = token;
        await teacher.save();

        return res.status(200).json({
            message: 'Đăng nhập thành công',
            data: {
                id: teacher._id,
                email: teacher.email,
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

        // Kiểm tra email tồn tại
        const teacher = await TeacherAccount.findOne({ email });
        if (!teacher) {
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
                otp, 
            },
            { upsert: true }
        );
        
        await sendMail(email, 'Mã OTP xác thực', `<p>Mã OTP của bạn là: <b>${otp}</b></p>`);

        return res.status(200).json({
            message: 'Mã OTP đã được gửi vào email của bạn',
            data: {
                email,
                otp
            }
        });
    } catch (error) {
        console.error('Lỗi quên mật khẩu:', error);
        return res.status(500).json({
            code: 500,
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
                code: 400,
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
            code: 200,
            message: 'Xác thực OTP thành công',
            data: {
                email: otpStore.email,
                resetToken
            }
        });
    } catch (error) {
        console.error('Lỗi xác thực OTP đặt lại mật khẩu:', error);
        return res.status(500).json({
            code: 500,
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

        // Tìm giáo viên bằng email từ token
        const teacher = await TeacherAccount.findOne({ email: decoded.email });
        if (!teacher) {
            return res.status(404).json({
                message: 'Không tìm thấy tài khoản giáo viên'
            });
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật mật khẩu
        teacher.password = hashedPassword;
        await teacher.save();

        // Xóa OTP đã sử dụng
        await OTP.deleteOne({ email: decoded.email });

        return res.status(200).json({
            code: 200,
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
        const teacherId = req.teacher.id;

        if (newPassword !== reenterNewPassword) {
            return res.status(400).json({
                message: "Xác nhận mật khẩu không chính xác"
            })
        }

        // Tìm giáo viên trong database
        const teacher = await TeacherAccount.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({
                message: 'Không tìm thấy tài khoản giáo viên'
            });
        }

        // Kiểm tra mật khẩu hiện tại
        const isMatch = await bcrypt.compare(currentPassword, teacher.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Mật khẩu hiện tại không chính xác'
            });
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật mật khẩu
        teacher.password = hashedPassword;
        await teacher.save();

        return res.status(200).json({
            code: 200,
            message: 'Đổi mật khẩu thành công'
        });
    } catch (error) {
        console.error('Lỗi đổi mật khẩu:', error);
        return res.status(500).json({
            code: 500,
            message: 'Lỗi máy chủ'
        });
    }
};

// Đăng xuất
module.exports.logout = async (req, res) => {
    try {
        const teacherId = req.teacher.id;

        // Xóa token
        await TeacherAccount.findByIdAndUpdate(teacherId, { token: undefined });

        return res.status(200).json({
            code: 200,
            message: 'Đăng xuất thành công'
        });
    } catch (error) {
        console.error('Lỗi đăng xuất:', error);
        return res.status(500).json({
            code: 500,
            message: 'Lỗi máy chủ'
        });
    }
};
