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
