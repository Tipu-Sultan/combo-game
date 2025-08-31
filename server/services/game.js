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
    const currentBalance = parseFloat(user?.balance || 0);
    const bet = parseFloat(betAmount);

    if (!user || currentBalance < bet) {
      throw new Error('Insufficient balance');
    }

    const game = await gameModel.getGameById(gameId, connection);
    if (!game) {
      throw new Error('Game not found or inactive');
    }

    if (bet < game.min_bet || bet > game.max_bet) {
      throw new Error('Invalid bet amount');
    }

    let won = false;
    let winAmount = 0;
    let levelsCrossed = 0;

    if (game.name === 'Car Race' && targetLevel) {
      // Car Race game logic
      const maxLevels = 11;
      if (targetLevel < 1 || targetLevel > maxLevels) {
        throw new Error('Invalid target level');
      }

      for (let i = 1; i <= targetLevel; i++) {
        if (Math.random() < 0.5) {
          break; // Crash
        }
        levelsCrossed = i;
      }

      if (levelsCrossed >= targetLevel) {
        won = true;
        winAmount = targetLevel === maxLevels
          ? bet + 9 * levelsCrossed
          : 9 * levelsCrossed;
      }
    } else {
      // Default game logic
      won = Math.random().toFixed(4) < game.win_rate;
      winAmount = won ? bet * game.win_multiplier : 0;
    }

    // Ensure 2 decimals for all financial calculations
    const normalizedWin = parseFloat(winAmount.toFixed(2));
    const netAmount = won
      ? parseFloat((normalizedWin - bet).toFixed(2))
      : bet;
    const newBalance = won
      ? parseFloat((currentBalance + netAmount).toFixed(2))
      : parseFloat((currentBalance - netAmount).toFixed(2));

    await userModel.updateUserBalance(userId, newBalance, connection);

    const transactionType = won ? 'game_win' : 'game_loss';
    const transactionAmount = won ? normalizedWin : bet;
    const description =
      game.name === 'Car Race'
        ? `${won ? 'Won' : 'Lost'} ${game.name} - Bet: ₹${bet.toFixed(
            2
          )}, Levels: ${levelsCrossed}/${targetLevel}`
        : `${won ? 'Won' : 'Lost'} ${game.name} - Bet: ₹${bet.toFixed(2)}`;

    await transactionModel.createTransaction(
      userId,
      transactionType,
      parseFloat(transactionAmount.toFixed(2)),
      gameId,
      description,
      connection
    );

    await gameStatisticsModel.updateGameStatistics(
      userId,
      gameId,
      bet,
      normalizedWin,
      won,
      connection
    );
    await gameModel.updateGameStats(gameId, bet, connection);

    await connection.commit();

    return {
      success: true,
      won,
      betAmount: bet.toFixed(2),
      winAmount: won ? normalizedWin.toFixed(2) : bet.toFixed(2),
      netAmount: netAmount.toFixed(2),
      newBalance: newBalance.toFixed(2),
      game: game.name,
      message:
        game.name === 'Car Race'
          ? won
            ? `You crossed ${levelsCrossed} levels!`
            : `Crashed at level ${levelsCrossed}`
          : won
          ? 'You won!'
          : 'You lost!',
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