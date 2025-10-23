const pool = require("../config/dbConfig").pool;

//! findUserByEmail This handler check in DB. Email is present in DB or not
const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM tbl_users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

//! findUserById This handler check in DB. if user id is present in DB or not
const findUserById = async (id) => {
  const result = await pool.query("SELECT * FROM tbl_users WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
};

//! createUser This handler create a new Detials of user.......
const createUser = async ({ full_name, email, phone, profilePic }) => {
  console.log("in create modal",profilePic)
  const result = await pool.query(
    "INSERT INTO tbl_users (full_name, email, phone, profilePic) VALUES ($1, $2, $3, $4) RETURNING *",
    [full_name, email, phone || null, profilePic || null]
  );
  return result.rows[0];
};

//! updateLastLogin This handler update last_login data. when user email is present in DB....
const updateLastLogin = async (email) => {
  const result = await pool.query(
    `UPDATE tbl_users SET last_login = NOW(), updated_at = NOW() WHERE email = $1 RETURNING *`,
    [email]
  );
  return result.rows[0];
};

//! updateUserActiveStatus This handler update is_Active status  when user login or logout our account then update is_active status.
const updateUserActiveStatus = async (email, isActive) => {
  const result = await pool.query(
    `UPDATE tbl_users SET is_active = $1, updated_at = NOW() WHERE email = $2 RETURNING *`,
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
