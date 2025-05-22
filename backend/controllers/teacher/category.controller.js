const Category = require('../../models/category.model');

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
