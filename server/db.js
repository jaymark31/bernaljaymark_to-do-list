// db.js
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

let pool;

if (process.env.NODE_ENV === "development") {
  // Development Pool
  pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "033105",
    database: process.env.DB_NAME || "to_do_list",
    port: process.env.DB_PORT || 5432,
  });
} else {
  // Production Pool (Render Postgres)
  pool = new Pool({
    connectionString: `postgres://${process.env.DB_USER || "postgres"}:${process.env.DB_PASSWORD || "033105"}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME}?options=project=${process.env.ENDPOINT_ID}`,
    ssl: { rejectUnauthorized: false },
  });
}

export default pool;
