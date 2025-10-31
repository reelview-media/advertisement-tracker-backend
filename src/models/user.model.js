const pool = require("../config/dbConfig").pool;

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM registered_users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};


const findUserById = async (id) => {
  const result = await pool.query("SELECT * FROM registered_users WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
};



const createUser = async ({ full_name, email, phone, profilePic,password }) => {
  const result = await pool.query(
   `INSERT INTO registered_users (full_name, email, phone, profilepic, password)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, full_name, email, phone, profilepic, created_at, updated_at, is_active, last_login`,
    [full_name, email, phone || null, profilePic || null, password || null]
  );
   return result.rows[0];
};


const updateLastLogin = async (email) => {
  const result = await pool.query(
    `UPDATE registered_users SET last_login = NOW(), updated_at = NOW() WHERE email = $1 RETURNING *`,
    [email]
  );
  return result.rows[0];
};


const updateUserActiveStatus = async (email, isActive) => {
  const result = await pool.query(
    `UPDATE registered_users SET is_active = $1, updated_at = NOW() WHERE email = $2 RETURNING *`,
    [isActive, email]
  );
  return result.rows[0];
};
module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateLastLogin,
  updateUserActiveStatus,
};
