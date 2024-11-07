const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const isAdmin = require('./protectedRoutes');  

// Protect the admin home route
router.get('/', isAdmin, adminController.getHomePage);

// Admin login routes 
router.get('/login', adminController.getLoginPage);
router.post('/login', adminController.login);

// Admin logout route (protected)
router.post('/logout', isAdmin, adminController.logout);

module.exports = router;

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