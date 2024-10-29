const getTeacherPage = (req, res) => {
    res.render('teacher-page', { message: 'Welcome to HUSTHUB!' });
};

module.exports = { getTeacherPage };