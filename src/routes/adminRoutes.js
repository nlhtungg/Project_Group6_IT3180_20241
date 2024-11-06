// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route for home page
router.get('/', adminController.getHomePage);


router.get('/courses', adminController.getCouresPage);
router.get('/courses/:course_id', adminController.getClassesPage);


// Route để xử lý đăng xuất
router.get('/logout', adminController.logout);

router.post('/search-courses', adminController.searchCourses);
// Route để tạo khóa học
router.post('/courses/create', adminController.createCourse);

// Route để xóa khóa học
router.post('/courses/delete', adminController.deleteCourse);

// Route để cập nhật khóa học
router.post('/courses/update', adminController.updateCourse);


module.exports = router;