import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Fix for "SECURITY WARNING" about sslmode
let connectionString = process.env.DATABASE_URL;
if (connectionString) {
  try {
    const url = new URL(connectionString);
    url.searchParams.delete('sslmode');
    connectionString = url.toString();
  } catch (err) {
    console.error('Error parsing DATABASE_URL:', err);
  }
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
