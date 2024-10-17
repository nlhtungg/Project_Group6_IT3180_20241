// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route for home page
router.get('/', adminController.getHomePage);
module.exports = router;
