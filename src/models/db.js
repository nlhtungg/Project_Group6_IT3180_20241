const os = require('os');
require('dotenv').config();

// Định nghĩa config cho cả hai nền tảng
let config;

if (os.platform() === 'darwin') {
    // Cấu hình cho macOS (M1) sử dụng Docker với thư viện `tedious`
    const { Connection, Request } = require('tedious');

    config = {
        server: 'localhost', // SQL Server chạy trên Docker
        authentication: {
            type: 'default',
            options: {
                userName: process.env.DB_USER || 'sa', // Lấy từ .env hoặc mặc định là 'sa'
                password: process.env.DB_PASSWORD || '123456aA@$', // Mật khẩu lấy từ .env
            }
        },
        options: {
            database: process.env.DB_NAME || 'HUSTHUB', // Tên database lấy từ .env
            encrypt: true, // Tùy chọn mã hóa
            trustServerCertificate: true, // Bỏ qua việc kiểm tra chứng chỉ
        }
    };

    async function connectDB() {
        try {
            const connection = new Connection(config);
            connection.on('connect', (err) => {
                if (err) {
                    console.error('Lỗi kết nối SQL Server trên macOS:', err);
                } else {
                    console.log('Kết nối thành công với SQL Server (macOS)!');
                    // Thực thi các câu truy vấn ở đây nếu cần
                }
            });
        } catch (err) {
            console.log('Lỗi kết nối:', err);
        }
    }

    module.exports = { connectDB };

} else {
    // Cấu hình cho Windows sử dụng `msnodesqlv8`
    const sql = require('mssql/msnodesqlv8');

    config = {
        server: process.env.DB_SERVER || 'DESKTOP-256OKAM\\SQLEXPRESS', // Lấy server từ .env hoặc giá trị mặc định
        database: process.env.DB_NAME || 'HUSTHUB', // Tên database
        user: process.env.DB_USER || 'TUNGSQLUsername', // Tên user SQL
        password: process.env.DB_PASSWORD || '892678', // Mật khẩu
        options: {
            trustedConnection: true, // Sử dụng Trusted Connection
        }
    };

    async function connectDB() {
        try {
            await sql.connect(config);
            console.log('Kết nối thành công với SQL Server (Windows)');
        } catch (err) {
            console.log('Lỗi kết nối:', err);
        }
    }

    module.exports = { sql, connectDB };
}


