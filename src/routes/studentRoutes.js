const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const { authenticateToken } = require("../middlewares/authenticateToken");
const {
  showStudentPage,
  uploadAvatar,
  generateQR,
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

module.exports = router;
