// db/createTables.js
const createUserTable = async (pool) => {
  const sql = `
   CREATE TABLE IF NOT EXISTS registered_users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(30),
    profilePic VARCHAR(255),
    password VARCHAR(255) DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

  `;
  await pool.query(sql);
  console.log("✅ registered_users created or already exists.");
};

module.exports = { createUserTable };
