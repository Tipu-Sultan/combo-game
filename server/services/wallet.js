const pool = require('../config/db');
const userModel = require('../models/user');
const transactionModel = require('../models/transaction');
const gameStatisticsModel = require('../models/gameStatistics');

const deposit = async (userId, amount) => {
  if (amount <= 0 || amount > 10000) {
    throw new Error('Invalid deposit amount');
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    await userModel.updateUserBalance(userId, (await userModel.getUserBalance(userId, connection)).balance + amount, connection);
    await transactionModel.createTransaction(userId, 'deposit', amount, null, 'Account deposit', connection);

    await connection.commit();

    const user = await userModel.getUserBalance(userId, connection);
    return { success: true, message: 'Deposit successful', newBalance: user.balance };
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
    if (!user || user.balance < amount) {
      throw new Error('Insufficient balance');
    }

    await userModel.updateUserBalance(userId, user.balance - amount, connection);
    await transactionModel.createTransaction(userId, 'withdrawal', amount, null, 'Account withdrawal', connection);

    await connection.commit();

    const updatedUser = await userModel.getUserBalance(userId, connection);
    return { success: true, message: 'Withdrawal successful', newBalance: updatedUser.balance };
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