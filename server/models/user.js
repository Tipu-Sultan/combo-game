const pool = require('../config/db');

const findUserByEmailOrName = async (valueType) => {
  const [results] = await pool.query('SELECT * FROM users WHERE email = ? OR username = ?', [valueType, valueType]);
  return results[0];
};

const createUser = async (username, email, hashedPassword) => {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, balance) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, 100.00]
  );
  return { id: result.insertId, username, email };
};

const getUserProfile = async (userId) => {
  const query = `
    SELECT 
      u.id, u.name, u.username as username, u.email, u.balance, u.created_at,
      COALESCE(SUM(CASE WHEN t.type = 'deposit' THEN t.amount ELSE 0 END), 0) as total_deposits,
      COALESCE(SUM(CASE WHEN t.type = 'withdrawal' THEN t.amount ELSE 0 END), 0) as total_withdrawals,
      COALESCE(SUM(CASE WHEN t.type = 'game_win' THEN t.amount ELSE 0 END), 0) as total_winnings,
      COALESCE(COUNT(CASE WHEN t.type IN ('game_win', 'game_loss') THEN 1 END), 0) as games_played
    FROM users u
    LEFT JOIN transactions t ON u.id = t.user_id
    WHERE u.id = ?
    GROUP BY u.id
  `;
  const [results] = await pool.query(query, [userId]);
  return results[0];
};

const getUserBalance = async (userId, connection) => {
  const [results] = await connection.query('SELECT balance FROM users WHERE id = ? FOR UPDATE', [userId]);
  return results[0];
};

const updateUserBalance = async (userId, balance, connection) => {
  await connection.query('UPDATE users SET balance = ? WHERE id = ?', [balance, userId]);
};

const updateUserProfile = async (userId, { name, username, email, password }, connection) => {
  const fields = [];
  const values = [];

  if (name) {
    fields.push('name = ?');
    values.push(name);
  }
  if (username) {
    fields.push('username = ?');
    values.push(username);
  }
  if (email) {
    fields.push('email = ?');
    values.push(email);
  }
  if (password) {
    const hashedPassword = await require('bcryptjs').hash(password, 10);
    fields.push('password = ?');
    values.push(hashedPassword);
  }
  fields.push('updated_at = NOW()');

  if (fields.length === 1) { // Only updated_at
    return;
  }

  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  values.push(userId);

  await connection.query(query, values);

  const [updatedUser] = await connection.query('SELECT id, name, username, email, balance FROM users WHERE id = ?', [userId]);
  return updatedUser[0];
};

const findUserByEmailOrUsernameExcludingId = async (email, username, userId) => {
  const [results] = await pool.query(
    'SELECT * FROM users WHERE (email = ? OR username = ?) AND id != ?',
    [email, username, userId]
  );
  return results[0];
};

module.exports = {
  findUserByEmailOrName,
  createUser,
  getUserProfile,
  getUserBalance,
  updateUserBalance,
  updateUserProfile,
  findUserByEmailOrUsernameExcludingId,
};