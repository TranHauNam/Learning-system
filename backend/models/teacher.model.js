const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        accountType: {
            type: String,
            default: "teacher"
        },
        province: String,
        ward: String,
        school: String,
        surname: String,
        middleName: String,
        phone: String,
        gender: {
            type: String,
            enum: ['Nam', 'Nữ', 'Khác']
        },
        birthday: Date,
        avatar: String,
        bio: String, // mô tả ngắn về bản thân
        specialization: String, // chuyên môn
        education: String, // học vấn
        experience: Number, // năm kinh nghiệm
        // verified: {
        //     type: Boolean,
        //     default: false
        // },
        // verificationDocuments: [String],
        token: String,
        bankInfo: {
            bankName: String,
            accountNumber: String,
            accountHolder: String
        },
        // wallets: {
        //     momo: String,
        //     vnpay: String
        // },
        // status: {
        //     type: String,
        //     enum: ['active', 'inactive', 'pending'],
        //     default: 'pending'
        // },
        deleted: {
            type: Boolean,
            default: false
        },
        deleteAt: Date,
    },
    {
        timestamps: true
    }
);

const Teacher = mongoose.model("Teacher", teacherSchema, 'teachers');

module.exports = Teacher; 