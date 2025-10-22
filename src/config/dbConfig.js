
const { Pool } = require("pg");
const { createUserTable } = require("../db/createTables");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const dbConnect = async () => {
  try {
    await pool.connect(); 
    console.log("✅ Connected to Postgres");
    //* Create tables if not exists
    await createUserTable(pool);
    return true;
  } catch (err) {
    console.error("DB connection error:", err);
    throw err;
  }
};

module.exports = { pool, dbConnect };
