const pool = require('../config/db');

const createTransaction = async (userId, type, amount, gameId, description, connection) => {
  await connection.query(
    `INSERT INTO transactions (user_id, type, amount, game_id, description, status)
     VALUES (?, ?, ?, ?, ?, 'completed')`,
    [userId, type, amount, gameId, description]
  );
};

const getUserTransactions = async (userId) => {
  const query = `
    SELECT 
      t.*, 
      g.name as game_name,
      g.icon as game_icon
    FROM transactions t
    LEFT JOIN games g ON t.game_id = g.id
    WHERE t.user_id = ?
    ORDER BY t.created_at DESC
    LIMIT 50
  `;
  const [results] = await pool.query(query, [userId]);
  return results;
};

module.exports = { createTransaction, getUserTransactions };