const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
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
        fullName: String,
        phone: String,
        avatar: String,
        role: {
            type: String,
            enum: ['admin', 'super_admin'],
            default: 'admin'
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        },
        token: String,
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    }
);

const Admin = mongoose.model('Admin', adminSchema, 'admins');

module.exports = Admin;
