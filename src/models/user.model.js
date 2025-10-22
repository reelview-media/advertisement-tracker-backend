const pool = require("../config/dbConfig").pool;

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM tbl_users WHERE email = $1", [email]);
  return result.rows[0];
};

const createUser = async ({ full_name, email, password }) => {
  const result = await pool.query(
    "INSERT INTO tbl_users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id, full_name, email",
    [full_name, email, password]
  );
  return result.rows[0];
};

module.exports = { findUserByEmail, createUser };
