const express = require('express');
const router = express.Router();
const { showTeacherPage } = require('../controllers/teacherController');

router.get('/', showTeacherPage);

module.exports = router;
