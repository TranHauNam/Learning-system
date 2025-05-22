const express = require('express');
const router = express.Router();
const controller = require('../../controllers/teacher/category.controller');

router.get('/', controller.getAllCategories);

module.exports = router; 