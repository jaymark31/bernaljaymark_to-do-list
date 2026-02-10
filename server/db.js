import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Normalize DATABASE_URL for pg v9: use sslmode=verify-full explicitly to avoid
// "prefer"/"require"/"verify-ca" alias warning and keep strict SSL verification.
function connectionStringWithExplicitSSL(url) {
  if (!url) return url;
  try {
    const u = new URL(url);
    u.searchParams.delete('sslmode');
    u.searchParams.delete('uselibpqcompat');
    u.searchParams.set('sslmode', 'verify-full');
    return u.toString();
  } catch {
    return url;
  }
}

const pool = new Pool({
  connectionString: connectionStringWithExplicitSSL(process.env.DATABASE_URL),
  ssl: {
    rejectUnauthorized: true  // ensures full verification
  }
});

export default pool;
