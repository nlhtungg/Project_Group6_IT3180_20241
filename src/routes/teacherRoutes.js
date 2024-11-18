const express = require('express');
const router = express.Router();
const teacherController  = require('../controllers/teacherController');

router.get('/', teacherController.getTeacherPage);

router.get('/logout', teacherController.logout);

module.exports = router;