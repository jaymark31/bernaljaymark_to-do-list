import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Fix for "SECURITY WARNING" about sslmode
let connectionString = process.env.DATABASE_URL;
if (connectionString) {
  connectionString = connectionString.replace(/(\?|&)sslmode=require/, '');
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: true, // ✅ verify the certificate
  },
});

// Test connection
pool.connect()
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.error("❌ DATABASE CONNECTION FAILED:", err));

export default pool;
