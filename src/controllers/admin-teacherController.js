// src/controllers/teacherController.js

const { pool } = require('../models/db');

// Get Teachers Page with Pagination
const getTeachersPage = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 100;
    const offset = (page - 1) * limit;

    try {
        const countResult = await pool.query('SELECT COUNT(*) FROM teachers');
        const totalTeachers = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalTeachers / limit);

        const result = await pool.query('SELECT * FROM teachers LIMIT $1 OFFSET $2', [limit, offset]);
        const teachers = result.rows;
        res.render('admin-teacher-page', {
            teachers,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).send('Server Error');
    }
};

// Create New Teacher
const createTeacher = async (req, res) => {
    const { teacher_id, teacher_name, teacher_faculty, teacher_email } = req.body;
    try {
        // Check if a teacher with the same fields already exists
        const existingTeacher = await pool.query(
            'SELECT * FROM teachers WHERE teacher_id = $1 AND teacher_name = $2 AND teacher_faculty = $3 AND teacher_email = $4',
            [teacher_id, teacher_name, teacher_faculty, teacher_email]
        );

        if (existingTeacher.rows.length > 0) {
            return res.status(400).send('Teacher with the same details already exists.');
        }

        // Insert the new teacher
        await pool.query(
            'INSERT INTO teachers (teacher_id, teacher_name, teacher_faculty, teacher_email) VALUES ($1, $2, $3, $4)',
            [teacher_id, teacher_name, teacher_faculty, teacher_email]
        );
        res.redirect('/admin/teacher');
    } catch (error) {
        console.error('Error creating teacher:', error);
        res.status(500).send('Server Error');
    }
};

// Update Existing Teacher
const updateTeacher = async (req, res) => {
    const { teacher_id, teacher_name, teacher_faculty, teacher_email } = req.body;
    try {
        // Fetch the current teacher data
        const currentTeacher = await pool.query('SELECT * FROM teachers WHERE teacher_id = $1', [teacher_id]);

        if (currentTeacher.rows.length === 0) {
            return res.status(404).send('Teacher not found.');
        }

        const teacher = currentTeacher.rows[0];

        // Update only if there are changes
        if (
            teacher.teacher_name !== teacher_name ||
            teacher.teacher_faculty !== teacher_faculty ||
            teacher.teacher_email !== teacher_email
        ) {
            await pool.query(
                'UPDATE teachers SET teacher_name = $1, teacher_faculty = $2, teacher_email = $3 WHERE teacher_id = $4',
                [teacher_name, teacher_faculty, teacher_email, teacher_id]
            );
        }

        res.redirect('/admin/teacher');
    } catch (error) {
        console.error('Error updating teacher:', error);
        res.status(500).send('Server Error');
    }
};

// Delete Teacher
const deleteTeacher = async (req, res) => {
    const { teacher_id } = req.body;
    try {
        await pool.query('DELETE FROM teachers WHERE teacher_id = $1', [teacher_id]);
        res.redirect('/admin/teacher');
    } catch (error) {
        console.error('Error deleting teacher:', error);
        res.status(500).send('Server Error');
    }
};

// Search Teachers
const searchTeachers = async (req, res) => {
    const { query } = req.query;
    try {
        const searchQuery = `%${query}%`;
        const result = await pool.query(
            'SELECT * FROM teachers WHERE teacher_id ILIKE $1 OR teacher_name ILIKE $1',
            [searchQuery]
        );
        res.json({ teachers: result.rows });
    } catch (error) {
        console.error('Error searching teachers:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = {
    getTeachersPage,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    searchTeachers
};