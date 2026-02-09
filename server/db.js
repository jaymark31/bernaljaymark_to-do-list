// db.js
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

// Test connection
pool.connect()
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.error("❌ DATABASE CONNECTION FAILED:", err));

export default pool;
