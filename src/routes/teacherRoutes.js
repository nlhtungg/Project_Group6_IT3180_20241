const express = require('express');
const router = express.Router();
const teacherController  = require('../controllers/teacherController');

router.get('/', teacherController.getTeacherPage);
router.get('/classes', teacherController.getTeacherClasses);
router.get('/logout', teacherController.logout);
router.get('/profile', teacherController.getTeacherProfile);
router.post('/profile/update', teacherController.updateTeacherProfile);
router.post('/profile/update-password', teacherController.updateTeacherPassword);
router.get('/classes/:class_id', teacherController.getClassDetails);

module.exports = router;