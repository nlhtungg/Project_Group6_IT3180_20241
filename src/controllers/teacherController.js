const { pool } = require('../models/db');


const getTeacherPage = async(req, res) => {
    const user = req.session.user;
    const teacherName = user.teacher_name;
    const teacherFaculty = user.teacher_faculty;
    const classesResult = await pool.query(`SELECT COUNT(DISTINCT(class_id)) FROM Classes WHERE teacher_id = $1`, [user.teacher_id]);
    const numberOfClasses = classesResult.rows.length;
    res.render('teacher', { teacherName, teacherFaculty, classes: classesResult.rows, numberOfClasses });
};

// New function to render the /teacher/classes page
const getTeacherClasses = async (req, res) => {
    try {
        const user = req.session.user;
        const { search, sort_by, order } = req.query;
        
        // Default sorting parameters
        let orderBy = 'Classes.class_id';  // Default column to sort by
        let orderDirection = 'ASC';        // Default sort order (ascending)
        
        // Update sort column and direction if specified
        if (sort_by) {
            if(sort_by === 'start_time') {
                sort_by = 'class_time_day';
            }
            orderBy = sort_by;
            console.log(orderBy);
        }
        if (order) {
            orderDirection = order === 'ASC' ? 'ASC' : 'DESC';
        }

        let query = `
            SELECT Classes.*, Courses.course_name 
            FROM Classes 
            JOIN Courses ON Classes.course_id = Courses.course_id 
            WHERE Classes.teacher_id = $1
        `;
        const params = [user.teacher_id];

        // Modify query if there is a search term
        if (search) {
            query += ` AND (Classes.class_id::TEXT ILIKE $2 OR Classes.course_id::TEXT ILIKE $2 OR Courses.course_name ILIKE $2)`;
            params.push(`%${search}%`);
        }

        // Add sorting to the query
        query += ` ORDER BY ${orderBy} ${orderDirection}`;
        
        const classesResult = await pool.query(query, params);
        res.render('teacher-classes', { classes: classesResult.rows, search, sort_by, order });
    } catch (error) {
        console.error("Error fetching teacher's classes:", error);
        res.sendStatus(500); // Internal Server Error
    }
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

module.exports = { getTeacherPage, getTeacherClasses, logout };
