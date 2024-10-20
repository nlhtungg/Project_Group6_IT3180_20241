const { sql } = require('./db'); 

const getAdminByUsername = async (username) => {
    try {
        const pool = await sql.connect(); 
        const result = await pool
            .request()
            .input('username', sql.VarChar, username)
            .query('SELECT * FROM admins WHERE username = @username');

        return result.recordset[0]; 
    } catch (error) {
        throw error;
    }
};

const validateAdminCredentials = async (username, password) => {
    const admin = await getAdminByUsername(username);
    if (!admin){
        throw new Error('Wrong username');
    } else if(admin.password !== password) { 
        throw new Error('Wrong password');
    }
    return admin;
};

module.exports = { getAdminByUsername, validateAdminCredentials };
