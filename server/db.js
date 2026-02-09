import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: "neondb_owner",
  host: "ep-gentle-fog-a1j0swvk-pooler.ap-southeast-1.aws.neon.tech",
  database: "neondb",
  password: "npg_7Gwt3DjHIQoc",
  port: 5432,
  ssl: {
    rejectUnauthorized: true
  }
});

pool.connect()
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.error("❌ DATABASE CONNECTION FAILED:", err));

export default pool;
