// src/controllers/adminController.js
const getHomePage = (req, res) => {
    // Fetch the data you need, for example:
    const totalStudents = 100; // This should be retrieved from your database
    const totalClasses = 10;
    const totalTeachers = 15;
    const feesCollection = 5000;

    // Pass the data to the EJS template
    res.render('admin-home-page', {
        totalStudents,
        totalClasses,
        totalTeachers,
        feesCollection,
        notices: [] // You can also pass notices here if needed
    });
};


 

module.exports = { getHomePage };
  