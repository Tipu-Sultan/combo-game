const pool = require('../config/db');
const userModel = require('../models/user');
const gameModel = require('../models/game');
const transactionModel = require('../models/transaction');
const gameStatisticsModel = require('../models/gameStatistics');

const getActiveGames = async () => {
  return await gameModel.getActiveGames();
};

const playGame = async (userId, gameId, betAmount, targetLevel = null) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const user = await userModel.getUserBalance(userId, connection);
    if (!user || user.balance < betAmount) {
      throw new Error('Insufficient balance');
    }

    const game = await gameModel.getGameById(gameId, connection);
    if (!game) {
      throw new Error('Game not found or inactive');
    }

    if (betAmount < game.min_bet || betAmount > game.max_bet) {
      throw new Error('Invalid bet amount');
    }

    let won = false;
    let winAmount = 0;
    let levelsCrossed = 0;

    if (game.name === 'Car Race' && targetLevel) {
      // Car game logic
      const maxLevels = 11;
      if (targetLevel < 1 || targetLevel > maxLevels) {
        throw new Error('Invalid target level');
      }

      // Simulate car advancing with 50% chance to crash at each level
      for (let i = 1; i <= targetLevel; i++) {
        if (Math.random() < 0.5) {
          // Crash
          break;
        }
        levelsCrossed = i;
      }

      if (levelsCrossed >= targetLevel) {
        won = true;
        winAmount = targetLevel === maxLevels ? betAmount + 9 * levelsCrossed : 9 * levelsCrossed;
      }
    } else {
      // Default game logic (e.g., slots)
      won = Math.random().toFixed(4) < game.win_rate;
      winAmount = won ? betAmount * game.win_multiplier : 0;
    }

    const netAmount = won ? winAmount - betAmount : -betAmount;
    const newBalance = user.balance + netAmount;

    await userModel.updateUserBalance(userId, newBalance, connection);

    const transactionType = won ? 'game_win' : 'game_loss';
    const transactionAmount = won ? winAmount : betAmount;
    const description = game.name === 'Car Race'
      ? `${won ? 'Won' : 'Lost'} ${game.name} - Bet: ₹${Number(betAmount).toFixed(2)}, Levels: ${levelsCrossed}/${targetLevel}`
      : `${won ? 'Won' : 'Lost'} ${game.name} - Bet: ₹${Number(betAmount).toFixed(2)}`;

    await transactionModel.createTransaction(
      userId,
      transactionType,
      transactionAmount,
      gameId,
      description,
      connection
    );

    await gameStatisticsModel.updateGameStatistics(userId, gameId, betAmount, winAmount, won, connection);
    await gameModel.updateGameStats(gameId, betAmount, connection);

    await connection.commit();

    return {
      success: true,
      won,
      betAmount,
      winAmount: won ? winAmount : 0,
      netAmount,
      newBalance,
      game: game.name,
      message: game.name === 'Car Race' ? (won ? `You crossed ${levelsCrossed} levels!` : `Crashed at level ${levelsCrossed}`) : (won ? 'You won!' : 'You lost!'),
      levelsCrossed: game.name === 'Car Race' ? levelsCrossed : null,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = { getActiveGames, playGame };