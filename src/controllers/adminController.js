const {validateAdminCredentials } = require('../models/adminModel');


const getHomePage = (req, res) => {
    const totalStudents = 100; 
    const totalClasses = 10;
    const totalTeachers = 15;
    const feesCollection = 5000;

    res.render('admin-home-page', {
        totalStudents,
        totalClasses,
        totalTeachers,
        feesCollection,
        notices: [] 
    });
};

const getLoginPage = (req, res) => {
    res.render('admin-login-page', { error: null });
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await validateAdminCredentials(username, password); 
        req.session.user = { username: admin.username, role: admin.role };
        return res.redirect('/admin'); 
    } catch (error) {
        console.error(error);
        return res.render('admin-login-page', { error: error.message }); 
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Error logging out:", err);
            return res.redirect('/admin'); 
        }
        res.clearCookie('sessionId'); 
        res.redirect('/'); 
    });
};

module.exports = { getHomePage, getLoginPage, login, logout };
