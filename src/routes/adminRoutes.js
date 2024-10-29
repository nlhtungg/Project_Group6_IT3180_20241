// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route for home page
router.get('/', adminController.getHomePage);


router.get('/courses', adminController.getCouresPage);
module.exports = router;

// Route để xử lý đăng xuất
router.get('/logout', adminController.logout);

router.post('/search-courses', adminController.searchCourses);

module.exports = router;