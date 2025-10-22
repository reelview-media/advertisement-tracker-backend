const pool = require("../config/dbConfig").pool;

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM tbl_users WHERE email = $1", [email]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query("SELECT * FROM tbl_users WHERE id = $1", [id]);
  return result.rows[0];
};

const createUser = async ({ full_name, email, phone, profilePic }) => {
  const result = await pool.query(
    "INSERT INTO tbl_users (full_name, email, phone, profilePic) VALUES ($1, $2, $3, $4) RETURNING *",
    [full_name, email, phone || null, profilePic || null]
  );
  return result.rows[0];
};


const updateLastLogin = async (email) => {
  const result = await pool.query(
    `UPDATE tbl_users SET last_login = NOW(), updated_at = NOW() WHERE email = $1 RETURNING *`,
    [email]
  );
  return result.rows[0];
};

module.exports = {findUserByEmail, findUserById, createUser, updateLastLogin };
