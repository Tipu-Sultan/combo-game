const pool = require('../config/db');

const getActiveGames = async () => {
  const [results] = await pool.query('SELECT * FROM games WHERE active = 1 ORDER BY name');
  return results;
};

const getGameById = async (gameId, connection) => {
  const [results] = await connection.query('SELECT * FROM games WHERE id = ? AND active = 1', [gameId]);
  return results[0];
};

const updateGameStats = async (gameId, betAmount, connection) => {
  await connection.query(
    'UPDATE games SET total_plays = total_plays + 1, total_wagered = total_wagered + ? WHERE id = ?',
    [betAmount, gameId]
  );
};

const createGame = async (gameData, connection) => {
  const { name, description, min_bet, max_bet, win_rate, win_multiplier, icon } = gameData;
  const [result] = await connection.query(
    'INSERT INTO games (name, description, min_bet, max_bet, win_rate, win_multiplier, icon, active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
    [name, description, min_bet, max_bet, win_rate, win_multiplier, icon]
  );
  return { id: result.insertId };
};

module.exports = { getActiveGames, getGameById, updateGameStats, createGame };