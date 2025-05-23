const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
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
        otp: { 
            type: String, 
            required: true 
        },
        role: {
            type: String,
            required: true
        },
        createdAt: { type: Date, default: Date.now, expires: 300 } // Hết hạn sau 5 phút
    }
);

const OTP = mongoose.model("OTP", otpSchema, 'otps');

module.exports = OTP;