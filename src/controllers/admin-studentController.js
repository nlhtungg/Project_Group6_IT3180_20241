// src/controllers/studentController.js

const { pool } = require('../models/db');

// Get Students Page with Pagination
const getStudentsPage = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 100;
    const offset = (page - 1) * limit;

    try {
        const countResult = await pool.query('SELECT COUNT(*) FROM students');
        const totalStudents = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalStudents / limit);

        const result = await pool.query('SELECT * FROM students LIMIT $1 OFFSET $2', [limit, offset]);
        const students = result.rows;
        res.render('admin-student-page', {
            students,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Server Error');
    }
};

// Create New Student
const createStudent = async (req, res) => {
    const { student_id, student_name, student_dob, student_email, student_major } = req.body;
    try {
        // Check if a student with the same ID or email already exists
        const existingStudent = await pool.query(
            'SELECT * FROM students WHERE student_id = $1 OR student_email = $2',
            [student_id, student_email]
        );

        if (existingStudent.rows.length > 0) {
            return res.status(400).json({ error: 'Student with the same ID or email already exists.' });
        }

        // Insert the new student
        await pool.query(
            'INSERT INTO students (student_id, student_name, student_dob, student_email, student_major) VALUES ($1, $2, $3, $4, $5)',
            [student_id, student_name, student_dob, student_email, student_major]
        );
        res.status(200).json({ message: 'Student added successfully.' });
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Update Existing Student
const updateStudent = async (req, res) => {
    const { student_id, student_name, student_dob, student_email, student_major } = req.body;
    try {
        // Fetch the current student data
        const currentStudent = await pool.query('SELECT * FROM students WHERE student_id = $1', [student_id]);

        if (currentStudent.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        // Update the student data
        await pool.query(
            'UPDATE students SET student_name = $1, student_dob = $2, student_email = $3, student_major = $4 WHERE student_id = $5',
            [student_name, student_dob, student_email, student_major, student_id]
        );

        res.status(200).json({ message: 'Student updated successfully.' });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Delete Student
const deleteStudent = async (req, res) => {
    const { student_id } = req.body;
    try {
        await pool.query('DELETE FROM students WHERE student_id = $1', [student_id]);
        res.redirect('/admin/student');
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send('Server Error');
    }
};

// Search Students
const searchStudents = async (req, res) => {
    const { query } = req.query;
    try {
        const searchQuery = `%${query}%`;
        const result = await pool.query(
            'SELECT * FROM students WHERE student_id ILIKE $1 OR student_name ILIKE $1',
            [searchQuery]
        );
        res.json({ students: result.rows });
    } catch (error) {
        console.error('Error searching students:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = {
    getStudentsPage,
    createStudent,
    updateStudent,
    deleteStudent,
    searchStudents
};