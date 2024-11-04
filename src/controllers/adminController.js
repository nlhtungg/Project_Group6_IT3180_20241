const express = require('express');
const { pool } = require('../models/db');
const router = express.Router(); 

// Hàm xử lý trang chủ admin
const getHomePage = async (req, res) => { 
    const totalStudentsdb = await pool.query(`SELECT COUNT(*) FROM Students;`);
    const totalTeachersdb = await pool.query(`SELECT COUNT(*) FROM Teachers;`);
    const totalClassessdb = await pool.query(`SELECT COUNT(*) FROM Classes;`);
    const totalStudents = totalStudentsdb.rows[0].count;
    const totalTeachers = totalTeachersdb.rows[0].count;
    const totalClasses = totalClassessdb.rows[0].count;

    res.render('admin-home-page', {
        totalStudents,
        totalClasses,
        totalTeachers,
        notices: []
    });
};

// Hàm xử lý đăng xuất
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Error logging out:", err);
            return res.redirect('/admin');
        }
        res.clearCookie('sessionId'); // Xóa cookie session
        res.redirect('/'); // Điều hướng đến trang chủ sau khi đăng xuất
    });
};
const searchCourses = async (req, res) => {
    const { searchText } = req.body;

    if (!searchText) {
        return res.status(400).send('Vui lòng nhập thông tin tìm kiếm!');
    }

    try {
        // Truy vấn cơ sở dữ liệu
        const result = await pool.query(
            searchText
                ? `SELECT * FROM Courses WHERE (course_id LIKE $1 OR course_name LIKE $1)`
                : `SELECT * FROM Courses`, 
            searchText ? [`%${searchText}%`] : []  
        );
        
        const courses = result.rows;

        // Trả về phần HTML chứa danh sách khóa học từ partial view
        res.render('partials/courses-list', { courses: courses });
    } catch (err) {
        console.error('Lỗi khi truy vấn cơ sở dữ liệu:', err);
        res.status(500).send('Có lỗi xảy ra');
    }
};

const createCourse = async (req, res) => {
    const { course_id, course_name, course_credit } = req.body;

    try {
        // Kiểm tra xem mã khóa học đã tồn tại chưa
        const course = await pool.query('SELECT * FROM Courses WHERE course_id = $1', [course_id]);
        if (course.rows.length > 0) {
            return res.status(400).send('Mã khóa học đã tồn tại');
        }

        // Thêm khóa học vào cơ sở dữ liệu
        await pool.query(
            'INSERT INTO Courses (course_id, course_name, course_description, course_credit) VALUES ($1, $2, $3)',
            [course_id, course_name, course_credit]
        );
        res.status(201).send('Khóa học đã được tạo');
    } catch (err) {
        console.error('Lỗi khi tạo khóa học:', err);
        res.status(500).send('Có lỗi xảy ra');
    }
};

const getCouresPage = async (req, res) => {
    // Pass the data to the EJS template
    const result = await pool.query('SELECT * FROM Courses');
    const courses = result.rows;  
   res.render('admin-courses-page', { courses: courses });
}

const getCoursesPage = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Courses');
        const courses = result.rows;  
        res.render('admin-courses-page', { courses: courses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send('Server Error');
    }
};

// Lấy chi tiết khóa học theo ID
const getCourseById = async (req, res) => {
    try {
        // Lấy course_id từ params của URL
        const courseId = req.params.course_id;

        // Kiểm tra giá trị của courseId
        console.log("Requested course_id:", courseId);

        const result = await pool.query('SELECT * FROM Courses WHERE course_id = $1', [courseId]);

        console.log("Query Result:", result.rows); // Kiểm tra dữ liệu truy vấn

        const course = result.rows[0];
        if (!course) {
            return res.status(404).render('404', { message: 'Course not found' });
        }

        // Render trang chi tiết khóa học với dữ liệu khóa học
        res.render('admin-courses-details', { course });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).send('Server Error');
    }
};



// Route
module.exports = { getHomePage, logout, searchCourses, getCouresPage, createCourse, getCourseById };

