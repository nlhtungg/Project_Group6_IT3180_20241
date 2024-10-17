const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

async function connectDB() {
    try {
        await sql.connect(config);
        console.log('Connected to database');
    } catch (err) {
        console.log(err);
    }
}

module.exports = { sql, connectDB };