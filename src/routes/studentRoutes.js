const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const { authenticateToken } = require("../middlewares/authenticateToken");
const {
  showStudentPage,
  uploadAvatar,
  generateQR,
  viewClasses,
  registerForClass,
  getGrades,
  getStudentTimetable,
} = require("../controllers/studentController");

// Route hiển thị trang sinh viên
router.get("/", authenticateToken, showStudentPage);

// Route xử lý upload avatar
router.post(
  "/upload-avatar",
  authenticateToken,
  upload.single("avatar"),
  uploadAvatar
);

//Route xử lý generate qr thanh toán học phí
router.post("/create-embedded-payment-link", authenticateToken, generateQR);

// Route xử lý lấy dữ liệu lớp học
router.get("/classes/:courseId", authenticateToken, viewClasses);

//đăng ký lớp
router.post("/register", authenticateToken, registerForClass);

//xem điểm
router.get("/grades", authenticateToken, getGrades);

router.get("/time-table", authenticateToken, getStudentTimetable);

module.exports = router;
