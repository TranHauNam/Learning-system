const mongoose = require('mongoose');

const adminAccountSchema = new mongoose.Schema(
    {
        fullName: String,
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }, 
        token: {
            type: String
        },
        phone: String,
        avatar: String,
        role: String,
        status: String,
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

const AdminAccount = mongoose.model("AdminAccount", adminAccountSchema, 'admin-accounts');

module.exports = AdminAccount
