const express = require('express');
const router = express.Router();
const middleware = require('../../middlewares/admin.middleware');
const controller = require('../../controllers/admin/category.controller');

// Áp dụng middleware xác thực admin cho tất cả các route

// Route để lấy danh sách tất cả danh mục (dạng cây)
router.get('/', middleware.authenticate, controller.getAllCategories);

// Route để tìm kiếm danh mục
router.get('/search', middleware.authenticate, controller.searchCategories);

// Route để tạo danh mục mới
router.post('/create', middleware.authenticate, controller.createCategory);

// Route để cập nhật danh mục
router.put('/:id', middleware.authenticate, controller.updateCategory);

// Route để xóa danh mục
router.delete('/:id', middleware.authenticate, controller.deleteCategory);

// Route để lấy danh sách danh mục con của một danh mục
router.get('/:parentId/subcategories', middleware.authenticate, controller.getSubCategories);

module.exports = router; 