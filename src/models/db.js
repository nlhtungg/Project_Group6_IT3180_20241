const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "HUSTHUB",
    password: "892678",
    port: "5433"
});

const connectDB = async () => {
    try {
      await pool.connect();
      console.log('Connected to the PostgreSQL database successfully');
    } catch (err) {
      console.error('Database connection error:', err.stack);
      process.exit(1);
    }
  };

module.exports = {pool, connectDB};