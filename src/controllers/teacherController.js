const showTeacherPage = (req, res) => {
    res.render('teacher-home-page');
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

module.exports = { showTeacherPage, logout };
