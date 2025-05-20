const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    totalAmount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Middleware để tính tổng tiền giỏ hàng trước khi lưu
cartSchema.pre('save', async function(next) {
    try {
        if (this.isModified('courses')) {
            const Course = mongoose.model('Course');
            const courses = await Course.find({ _id: { $in: this.courses } });
            this.totalAmount = courses.reduce((total, course) => total + course.price, 0);
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Phương thức để thêm khóa học vào giỏ hàng
cartSchema.methods.addCourse = async function(courseId) {
    if (!this.courses.includes(courseId)) {
        this.courses.push(courseId);
        await this.save();
    }
    return this;
};

// Phương thức để xóa khóa học khỏi giỏ hàng
cartSchema.methods.removeCourse = async function(courseId) {
    this.courses = this.courses.filter(id => id.toString() !== courseId.toString());
    await this.save();
    return this;
};

// Phương thức để xóa toàn bộ giỏ hàng
cartSchema.methods.clearCart = async function() {
    this.courses = [];
    this.totalAmount = 0;
    await this.save();
    return this;
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart; 