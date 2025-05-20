const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
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
            default: "student"
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
        grade: String,
        className: String,
        avatar: String,
        token: String,
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

const Student = mongoose.model("Student", studentSchema, 'students');

module.exports = Student; 