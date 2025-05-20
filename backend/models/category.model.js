const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: ''
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Tạo virtual field để lấy đường dẫn đầy đủ của danh mục
categorySchema.virtual('path').get(async function() {
    let path = [this.name];
    let currentParent = this.parent;
    
    const Category = mongoose.model('Category');
    
    while(currentParent) {
        const parent = await Category.findById(currentParent);
        if (parent) {
            path.unshift(parent.name);
            currentParent = parent.parent;
        } else {
            break;
        }
    }
    
    return path.join(' > ');
});

// Đảm bảo các virtual fields được đưa vào khi chuyển đổi sang JSON
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

const Category = mongoose.model('Category', categorySchema, 'categories');

module.exports = Category; 