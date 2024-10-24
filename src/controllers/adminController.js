// src/controllers/adminController.js
const { pool } = require('../models/db')
const getHomePage = async (req, res) => { // Thêm async ở đây
    // Fetch the data you need, for example:
    const totalStudentsdb = await pool.query(`SELECT COUNT(*) FROM Students;`);
    const totalTeachersdb = await pool.query(`SELECT COUNT(*) FROM Teachers;`);
    const totalClassessdb = await pool.query(`SELECT COUNT(*) FROM Classes;`);


    const totalStudents = totalStudentsdb.rows[0].count;
    const totalTeachers = totalTeachersdb.rows[0].count;
    const totalClasses = totalClassessdb.rows[0].count;


    // Pass the data to the EJS template
    res.render('admin-home-page', {
        totalStudents,
        totalClasses,
        totalTeachers,
        notices: [] // You can also pass notices here if needed
    });
};


// Hàm xử lý đăng xuất
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Error logging out:", err);
            return res.redirect('/admin'); // Nếu lỗi, quay lại trang admin
        }
        res.clearCookie('sessionId'); // Xóa cookie session nếu có
        res.redirect('/'); // Điều hướng đến trang chủ sau khi đăng xuất
    });
};



const getCouresPage = async (req, res) => {
     // Pass the data to the EJS template
     const result = await pool.query('SELECT * FROM Courses');
     const courses = result.rows;  
    res.render('admin-courses-page', { courses: courses });
}

module.exports = { getHomePage, logout, getCouresPage };