const { Pool } = require("pg");
require("dotenv").config();

let pool;

if (process.env.NODE_ENV === "production") {
  // Render, Railway, etc.
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  // Desarrollo local
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

// Logger y exportación unificada
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      console.log("executed query", { text });
      return res;
    } catch (error) {
      console.error("❌ error in query", { text, error });
      throw error;
    }
  },
};
