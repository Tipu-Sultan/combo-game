const pool = require('../config/db');

const createSession = async ({ userId, tokenHash, ipAddress, userAgent, expiresAt }) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      `INSERT INTO user_sessions (user_id, token_hash, ip_address, user_agent, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [userId, tokenHash, ipAddress, userAgent, expiresAt]
    );
  } finally {
    connection.release();
  }
};

const deleteSession = async (tokenHash) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      `DELETE FROM user_sessions WHERE token_hash = ?`,
      [tokenHash]
    );
  } finally {
    connection.release();
  }
};

module.exports = {
  createSession,
  deleteSession,
};
