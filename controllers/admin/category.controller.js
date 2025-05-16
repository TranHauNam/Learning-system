const Category = require('../../models/category.model');

// Lấy danh sách tất cả danh mục (có phân cấp)
module.exports.getAllCategories = async (req, res) => {
    try {
        // Lấy tất cả danh mục
        const categories = await Category.find()
            .populate('parent')
            .sort({ name: 1 });

        // Tổ chức danh mục theo cấu trúc cây
        const buildCategoryTree = (categories, parentId = null) => {
            const categoryTree = [];
            
            categories
                .filter(category => String(category.parent?._id || null) === String(parentId))
                .forEach(category => {
                    const children = buildCategoryTree(categories, category._id);
                    if (children.length) {
                        category = category.toObject();
                        category.children = children;
                    }
                    categoryTree.push(category);
                });
            
            return categoryTree;
        };

        const categoryTree = buildCategoryTree(categories);

        return res.status(200).json({
            success: true,
            message: "Lấy danh sách danh mục thành công",
            data: categoryTree
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Lấy danh sách danh mục con
module.exports.getSubCategories = async (req, res) => {
    try {
        const { parentId } = req.params;
        
        const subCategories = await Category.find({ parent: parentId })
            .populate('parent')
            .sort({ name: 1 });

        return res.status(200).json({
            success: true,
            message: "Lấy danh sách danh mục con thành công",
            data: subCategories
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Tìm kiếm danh mục theo tên
module.exports.searchCategories = async (req, res) => {
    try {
        const { keyword } = req.query;
        const searchRegex = new RegExp(keyword, 'i');
        
        const categories = await Category.find({
            name: { $regex: searchRegex }
        })
        .populate('parent')
        .sort({ name: 1 });

        return res.status(200).json({
            success: true,
            message: "Tìm kiếm danh mục thành công",
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Thêm danh mục mới
module.exports.createCategory = async (req, res) => {
    try {
        const { name, description, parentId } = req.body;
        // Kiểm tra xem danh mục đã tồn tại trong cùng cấp chưa
        const existingCategory = await Category.findOne({ 
            name,
            parent: parentId || null
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Danh mục này đã tồn tại trong cùng cấp'
            });
        }

        // Kiểm tra danh mục cha nếu có
        if (parentId) {
            const parentCategory = await Category.findById(parentId);
            if (!parentCategory) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy danh mục cha'
                });
            }
        }

        const newCategory = await Category.create({
            name,
            description,
            parent: parentId || null
        });

        await newCategory.populate('parent');

        return res.status(201).json({
            success: true,
            message: 'Tạo danh mục thành công',
            data: newCategory
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Cập nhật danh mục
module.exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, parentId } = req.body;

        // Kiểm tra xem danh mục có tồn tại không
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }

        // Kiểm tra xem tên mới đã tồn tại trong cùng cấp chưa
        if (name !== category.name) {
            const existingCategory = await Category.findOne({ 
                name,
                parent: parentId || null,
                _id: { $ne: id }
            });

            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Tên danh mục này đã tồn tại trong cùng cấp'
                });
            }
        }

        // Kiểm tra danh mục cha mới nếu có thay đổi
        if (parentId && parentId !== String(category.parent)) {
            // Không cho phép chọn chính nó hoặc các danh mục con làm cha
            if (parentId === id) {
                return res.status(400).json({
                    success: false,
                    message: 'Không thể chọn chính danh mục này làm danh mục cha'
                });
            }

            const parentCategory = await Category.findById(parentId);
            if (!parentCategory) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy danh mục cha'
                });
            }

            // Kiểm tra xem danh mục cha mới có phải là con của danh mục hiện tại không
            let currentParent = parentCategory.parent;
            while (currentParent) {
                if (String(currentParent) === id) {
                    return res.status(400).json({
                        success: false,
                        message: 'Không thể chọn danh mục con làm danh mục cha'
                    });
                }
                const parent = await Category.findById(currentParent);
                currentParent = parent ? parent.parent : null;
            }
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { 
                name,
                description,
                parent: parentId || null
            },
            { new: true }
        ).populate('parent');

        return res.status(200).json({
            success: true,
            message: 'Cập nhật danh mục thành công',
            data: updatedCategory
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Xóa danh mục
module.exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra xem danh mục có tồn tại không
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }

        // Kiểm tra xem danh mục có danh mục con không
        const hasChildren = await Category.exists({ parent: id });
        if (hasChildren) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xóa danh mục có chứa danh mục con'
            });
        }

        await Category.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: 'Xóa danh mục thành công'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
}; 