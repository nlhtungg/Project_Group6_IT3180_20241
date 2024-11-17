// src/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const studentController = require('../controllers/studentController');
const teacherController = require('../controllers/teacherController');

// Admin routes
router.get('/', adminController.getHomePage);
router.post('/logout', adminController.logout);
router.get('/courses', adminController.getCoursesPage);
router.get('/courses/:course_id', adminController.getClassesPage);
router.post('/search-courses', adminController.searchCourses);
router.post('/courses/create', adminController.createCourse);
router.post('/courses/update', adminController.updateCourse);
router.post('/courses/delete', adminController.deleteCourse);

// Teacher routes
router.get('/teacher', teacherController.getTeachersPage);
router.post('/teacher/create', teacherController.createTeacher);
router.post('/teacher/update', teacherController.updateTeacher);
router.post('/teacher/delete', teacherController.deleteTeacher);
// Search Teachers
router.get('/teacher/search', teacherController.searchTeachers);

// Student routes
router.get('/student', studentController.getStudentsPage);
router.post('/student/create', studentController.createStudent);
router.post('/student/update', studentController.updateStudent);
router.post('/student/delete', studentController.deleteStudent);
// Search Students
router.get('/student/search', studentController.searchStudents);

module.exports = router;