const { pool } = require("../models/db");
const PayOS = require("@payos/node");

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

const showStudentPage = async (req, res) => {
  try {
    const studentId = req.user.user_id;
    // Lấy thông tin sinh viên
    const studentResult = await pool.query(
      "SELECT * FROM students WHERE student_id = $1",
      [studentId]
    );

    // Lấy thông tin học phí
    const tuitionQuery = `
            SELECT c.course_id, c.course_name, c.course_credit
            FROM Enrollments e
            JOIN Classes cl ON e.class_id = cl.class_id
            JOIN Courses c ON cl.course_id = c.course_id
            WHERE e.student_id = $1
        `;
    const tuitionResult = await pool.query(tuitionQuery, [studentId]);

    if (studentResult.rows.length === 0) {
      return res.status(404).send("Student not found");
    }

    //Lấy thông tin tất cả khóa học để cho đăng ký lớp
    const courseQuery = `
            SELECT * FROM courses
        `;
    const coursesResult = await pool.query(courseQuery);

    //Lấy thông tin các lớp đăng ký
    const enrollmentQuery = `
        SELECT * FROM public.courses co
        JOIN public.classes cl ON cl.course_id = co.course_id
        JOIN public.enrollments en ON en.class_id = cl.class_id
        WHERE en.student_id = $1  
    `;
    const enrollmentResult = await pool.query(enrollmentQuery, [studentId]);

    res.render("student-page", {
      student: studentResult.rows[0],
      courses: coursesResult.rows,
      enrollments: enrollmentResult.rows,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const studentId = req.user.user_id;
    const avatarBuffer = req.file.buffer;

    await pool.query("UPDATE students SET avatar = $1 WHERE student_id = $2", [
      avatarBuffer,
      studentId,
    ]);

    res.json({
      success: true,
      avatar: avatarBuffer.toString("base64"),
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
};

const generateQR = async (req, res) => {
  const YOUR_DOMAIN = `http://localhost:3000`;
  const body = {
    orderCode: Number(String(Date.now()).slice(-6)),
    amount: 10000,
    description: "Thanh toan don hang",
    items: [
      {
        name: "Mì tôm Hảo Hảo ly",
        quantity: 1,
        price: 2000,
      },
    ],
    returnUrl: `${YOUR_DOMAIN}`,
    cancelUrl: `${YOUR_DOMAIN}`,
  };

  try {
    const paymentLinkResponse = await payOS.createPaymentLink(body);

    res.send(paymentLinkResponse);
  } catch (error) {
    console.error(error);
    res.send("Something went error");
  }
};

module.exports = { showStudentPage, uploadAvatar, generateQR };
