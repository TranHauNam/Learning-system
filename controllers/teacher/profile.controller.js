const TeacherAccount = require('../../models/teacher-account.model');

// Cập nhật thông tin cá nhân cơ bản
module.exports.updateProfile = async (req, res) => {
    try {
        const teacherId = req.teacher._id;
        const {
            surname,    
            middleName,     
            gender,         
            birthday,      
            avatar
        } = req.body;

        // Tạo object chứa các trường cần cập nhật
        const updateData = {};
        
        // Chỉ cập nhật các trường có dữ liệu
        if (surname !== undefined) updateData.surname = surname;
        if (middleName !== undefined) updateData.middleName = middleName;
        if (gender !== undefined) updateData.gender = gender;
        if (birthday !== undefined) updateData.birthday = birthday;
        if (avatar !== undefined) updateData.avatar = avatar;   

        // Cập nhật thông tin
        const updatedTeacher = await TeacherAccount.findByIdAndUpdate(
            teacherId,
            updateData,
            { new: true }
        ).select('-password -token');

        if (!updatedTeacher) {
            return res.status(404).json({
                message: 'Không tìm thấy thông tin giáo viên'
            });
        }

        return res.status(200).json({
            message: 'Cập nhật thông tin cá nhân thành công',
            data: updatedTeacher
        });
    } catch (error) {
        console.error('Lỗi cập nhật thông tin cá nhân:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};

// Cập nhật địa chỉ
module.exports.updateAddress = async (req, res) => {
    try {
        const teacherId = req.teacher._id;
        const { province, ward, school } = req.body;

        // Tạo object chứa thông tin địa chỉ
        const updateAddressData = {};
        if (province !== undefined) updateAddressData.province = province;
        if (ward !== undefined) updateAddressData.ward = ward;
        if (school !== undefined) updateAddressData.school = school;

        // Cập nhật thông tin địa chỉ
        const updatedTeacher = await TeacherAccount.findByIdAndUpdate(
            teacherId,
            updateAddressData,
            { new: true }
        ).select('-password -token');

        if (!updatedTeacher) {
            return res.status(404).json({
                message: 'Không tìm thấy thông tin giáo viên'
            });
        }

        return res.status(200).json({
            message: 'Cập nhật địa chỉ thành công',
            data: updatedTeacher
        });
    } catch (error) {
        console.error('Lỗi cập nhật địa chỉ:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ'
        });
    }
};
