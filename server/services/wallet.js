const pool = require('../config/db');
const userModel = require('../models/user');
const transactionModel = require('../models/transaction');
const gameStatisticsModel = require('../models/gameStatistics');

const deposit = async (userId, amount) => {
  if (amount <= 0 || amount > 100000) {
    throw new Error('Invalid deposit amount');
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const userBalance = await userModel.getUserBalance(userId, connection);

    // Ensure numbers are handled safely with 2 decimals
    const currentBalance = parseFloat(userBalance?.balance || 0);
    const depositUpdateBalance = parseFloat((currentBalance + parseFloat(amount)).toFixed(2));

    console.log('depositUpdateBalance', depositUpdateBalance);

    await userModel.updateUserBalance(userId, depositUpdateBalance, connection);
    await transactionModel.createTransaction(
      userId,
      'deposit',
      parseFloat(amount.toFixed(2)),
      null,
      'Account deposit',
      connection
    );

    await connection.commit();

    const user = await userModel.getUserBalance(userId, connection);

    // Return normalized balance
    return {
      success: true,
      message: 'Deposit successful',
      newBalance: parseFloat(user.balance).toFixed(2)
    };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};


const withdraw = async (userId, amount) => {
  if (amount <= 0) {
    throw new Error('Invalid withdrawal amount');
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const user = await userModel.getUserBalance(userId, connection);

    const currentBalance = parseFloat(user?.balance || 0);
    const withdrawAmount = parseFloat(amount);

    if (!user || currentBalance < withdrawAmount) {
      throw new Error('Insufficient balance');
    }

    // Normalize to 2 decimal places
    const newBalance = parseFloat((currentBalance - withdrawAmount).toFixed(2));

    await userModel.updateUserBalance(userId, newBalance, connection);
    await transactionModel.createTransaction(
      userId,
      'withdrawal',
      parseFloat(withdrawAmount.toFixed(2)),
      null,
      'Account withdrawal',
      connection
    );

    await connection.commit();

    const updatedUser = await userModel.getUserBalance(userId, connection);
    return {
      success: true,
      message: 'Withdrawal successful',
      newBalance: parseFloat(updatedUser.balance).toFixed(2)
    };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};


const getTransactions = async (userId) => {
  return await transactionModel.getUserTransactions(userId);
};

const getGameStatistics = async (userId) => {
  return await gameStatisticsModel.getUserGameStatistics(userId);
};

module.exports = { deposit, withdraw, getTransactions, getGameStatistics };