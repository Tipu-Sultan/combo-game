const pool = require('../config/db');

const getUserGameStatistics = async (userId) => {
  const query = `
    SELECT 
      gs.*,
      g.name as game_name,
      g.icon as game_icon
    FROM game_statistics gs
    LEFT JOIN games g ON gs.game_id = g.id
    WHERE gs.user_id = ?
    ORDER BY gs.last_played DESC
  `;
  const [results] = await pool.query(query, [userId]);
  return results;
};

const updateGameStatistics = async (userId, gameId, betAmount, winAmount, won, connection) => {
  const [existingStats] = await connection.query(
    'SELECT * FROM game_statistics WHERE user_id = ? AND game_id = ?',
    [userId, gameId]
  );
  if (existingStats.length) {
    const currentStreak = won
      ? existingStats[0].longest_streak >= 0
        ? existingStats[0].longest_streak + 1
        : 1
      : existingStats[0].longest_streak > 0
      ? -1
      : existingStats[0].longest_streak - 1;
    const longestStreak =
      Math.abs(currentStreak) > Math.abs(existingStats[0].longest_streak)
        ? currentStreak
        : existingStats[0].longest_streak;
    await connection.query(
      `UPDATE game_statistics SET
        total_plays = total_plays + 1,
        total_wagered = total_wagered + ?,
        total_won = total_won + ?,
        total_lost = total_lost + ?,
        biggest_win = GREATEST(biggest_win, ?),
        longest_streak = ?,
        last_played = NOW(),
        updated_at = NOW()
      WHERE user_id = ? AND game_id = ?`,
      [
        betAmount,
        winAmount,
        won ? 0 : betAmount,
        winAmount,
        longestStreak,
        userId,
        gameId,
      ]
    );
  } else {
    await connection.query(
      `INSERT INTO game_statistics (
        game_id, user_id, total_plays, total_wagered, total_won, total_lost,
        biggest_win, longest_streak, last_played, created_at, updated_at
      ) VALUES (?, ?, 1, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
      [
        gameId,
        userId,
        betAmount,
        winAmount,
        won ? 0 : betAmount,
        winAmount,
        won ? 1 : -1,
      ]
    );
  }
};

module.exports = { getUserGameStatistics, updateGameStatistics };