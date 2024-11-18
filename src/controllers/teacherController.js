const { pool } = require('../models/db');


const getTeacherPage = async(req, res) => {
    const user = req.session.user;
    const teacherName = user.teacher_name;
    const teacherFaculty = user.teacher_faculty;
    const classesResult = await pool.query(`SELECT * FROM Classes WHERE teacher_id = $1`, [user.teacher_id]);
    const numberOfClasses = classesResult.rows.length;
    res.render('teacher', { teacherName, teacherFaculty, classes: classesResult.rows, numberOfClasses });
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

module.exports = { getTeacherPage, logout };
