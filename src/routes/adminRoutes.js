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

// Route for courses
router.get('/courses', adminController.getCouresPage);
router.get('/courses/:course_id', adminController.getClassesPage);

// Route to search courses
router.post('/search-courses', adminController.searchCourses);

// Route to create a course
router.post('/courses/create', adminController.createCourse);

// Route to delete a course
router.post('/courses/delete', adminController.deleteCourse);

// Route to update a course
router.post('/courses/update', adminController.updateCourse);

module.exports = router;