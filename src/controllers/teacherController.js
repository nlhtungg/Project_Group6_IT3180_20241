const { pool } = require('../models/db');

const getTeacherPage = async(req, res) => {
    const user = req.session.user;
    const teacherName = user.teacher_name;
    const teacherFaculty = user.teacher_faculty;
    const classesResult = await pool.query(`SELECT DISTINCT(class_id) FROM Classes WHERE teacher_id = $1`, [user.teacher_id]);
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

// Get Profile Page
const getTeacherProfile = async (req, res) => {
    try {
        const user = req.session.user;
        const result = await pool.query('SELECT * FROM Teachers WHERE teacher_id = $1', [user.teacher_id]);
        const teacher = result.rows[0];
        res.render('teacher-profile', { teacher });
    } catch (error) {
        console.error("Error fetching teacher profile:", error);
        res.sendStatus(500);
    }
};

// Update Profile Information
const updateTeacherProfile = async (req, res) => {
    const { name, email } = req.body;
    const user = req.session.user;
    
    try {
        await pool.query(
            'UPDATE Teachers SET teacher_name = $1, teacher_email = $2 WHERE teacher_id = $3',
            [name, email, user.teacher_id]
        );
        req.session.user.teacher_name = name;
        req.session.user.teacher_email = email;
        res.redirect('/teacher/profile');
    } catch (error) {
        console.error("Error updating teacher profile:", error);
        res.sendStatus(500);
    }
};

// Update Password
const updateTeacherPassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = req.session.user;
    const teacher = req.session.user;

    try {
        // Get the current password from the database
        const result = await pool.query('SELECT password FROM Teachers WHERE teacher_id = $1', [user.teacher_id]);
        const oldPassword = result.rows[0];
        console.log('Old Password: ' + oldPassword.password);
        console.log('Current Password: ' + currentPassword);
        console.log('New Password: ' + newPassword);

        // Check if the current password matches
        const match = (currentPassword == oldPassword.password);
        if (!match) {
            const error = 'Incorrect current password.';
            console.log(error);
            return res.render('teacher-profile', { user, teacher, error });
        }

        // Check if new passwords match
        if (newPassword !== confirmPassword) {
            const error = 'New passwords do not match.';
            console.log(error);
            return res.render('teacher-profile', { user, teacher, error });
        }

        // Update the password
        await pool.query('UPDATE Teachers SET password = $1 WHERE teacher_id = $2', [newPassword, user.teacher_id]);
        const error = 'Password updated successfully.';
        console.log(error);
        return res.render('teacher-profile', { user, teacher, error });
    } catch (error) {
        console.error("Error updating password:", error);
        res.redirect('/teacher/profile');
    }
};

const getClassDetails = async (req, res) => {
    try {
        const { class_id } = req.params;

        // Query to fetch class details
        const classQuery = `
            SELECT Classes.*, Courses.course_name, Teachers.teacher_name
            FROM Classes
            JOIN Courses ON Classes.course_id = Courses.course_id
            JOIN Teachers ON Classes.teacher_id = Teachers.teacher_id
            WHERE Classes.class_id = $1
        `;
        const classResult = await pool.query(classQuery, [class_id]);

        if (classResult.rows.length === 0) {
            return res.status(404).send("Class not found");
        }

        const classDetails = classResult.rows[0];

        // Query to fetch students enrolled in the class
        const studentsQuery = `
            SELECT Students.student_id, Students.student_name, Students.student_email, Enrollments.enrollment_id, Grades.midterm_score, Grades.final_score
            FROM Enrollments
            JOIN Students ON Enrollments.student_id = Students.student_id
            LEFT JOIN Grades ON Enrollments.enrollment_id = Grades.enrollment_id
            WHERE Enrollments.class_id = $1
            ORDER BY SPLIT_PART(student_name, ' ', array_length(string_to_array(student_name, ' '), 1));
        `;
        const studentsResult = await pool.query(studentsQuery, [class_id]);
        const studentsList = studentsResult.rows;

        // Render class details page with class and student data
        res.render('class-detail', { classDetails, studentsList });
    } catch (error) {
        console.error('Error fetching class details:', error);
        res.sendStatus(500); // Internal Server Error
    }
};

const updateStudentScores = async (req, res) => {
    const { enrollment_id, midterm_score, final_score } = req.body;

    try {
        const checkEnrollmentId = await pool.query('SELECT * FROM Grades WHERE enrollment_id = $1', [enrollment_id]);
        console.log(checkEnrollmentId.rows.length);
        var query = ``;
        if(checkEnrollmentId.rows.length === 0) {
            query = `INSERT INTO Grades (enrollment_id, midterm_score, final_score) VALUES ($3, $1, $2)`;
            console.log(`INSERT INTO Grades (enrollment_id, midterm_score, final_score) VALUES (${midterm_score}, ${final_score}, ${enrollment_id})`);
        } else {
            query = ` UPDATE Grades SET midterm_score = $1, final_score = $2 WHERE enrollment_id = $3`;
            console.log(`UPDATE Grades SET midterm_score = ${midterm_score}, final_score = ${final_score} WHERE enrollment_id = ${enrollment_id}`);
        }
        console.log(midterm_score, final_score, enrollment_id);
        await pool.query(query, [midterm_score, final_score, enrollment_id]);
        res.status(200).send('Grades updated successfully');
    } catch (error) {
        console.error('Error updating grades:', error);
        res.status(500).send('Internal Server Error');
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

module.exports = { getTeacherPage, getTeacherClasses, getTeacherProfile, updateTeacherProfile, updateTeacherPassword, getClassDetails, updateStudentScores ,logout };
