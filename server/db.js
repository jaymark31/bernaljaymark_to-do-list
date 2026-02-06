// db.js
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

let pool;

if (process.env.NODE_ENV === "development") {
  // Local Development
  pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "033105",
    database: process.env.DB_NAME || "to_do_list",
    port: process.env.DB_PORT || 5432,
  });
} else {
  // Production - Neon
  pool = new Pool({
    connectionString: process.env.DATABASE_URL, // full Neon URL
    ssl: { rejectUnauthorized: false }, // required for Neon
  });
}

export default pool;
