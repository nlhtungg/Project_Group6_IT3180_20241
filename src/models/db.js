const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const config = {
    server: 'DESKTOP-256OKAM\\SQLEXPRESS',
    database: 'HUSTHUB',
    user: 'TUNGSQLUsername',
    password: '892678',
    options: {
        trustedConnection: true
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