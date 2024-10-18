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

module.exports = { getHomePage, logout };
  