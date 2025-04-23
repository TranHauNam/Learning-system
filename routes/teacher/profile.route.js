const express = require('express');
const router = express.Router();
const controller = require('../../controllers/teacher/profile.controller');
const middleware = require('../../middlewares/teacher.middleware');

router.put('/profile', middleware.authenticate, controller.updateProfile);
router.put('/profile/address', middleware.authenticate, controller.updateAddress);

module.exports = router;