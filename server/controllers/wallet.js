const walletService = require('../services/wallet');

const deposit = async (req, res) => {
  try {
    const { amount } = req.body;
    const result = await walletService.deposit(req.user.userId, amount);
    res.json(result);
  } catch (error) {
    console.error('Deposit error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

const withdraw = async (req, res) => {
  try {
    const { amount } = req.body;
    const result = await walletService.withdraw(req.user.userId, amount);
    res.json(result);
  } catch (error) {
    console.error('Withdrawal error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await walletService.getTransactions(req.user.userId);
    res.json(transactions);
  } catch (error) {
    console.error('Transactions fetch error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const getGameStatistics = async (req, res) => {
  try {
    const stats = await walletService.getGameStatistics(req.user.userId);
    res.json(stats);
  } catch (error) {
    console.error('Game statistics fetch error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { deposit, withdraw, getTransactions, getGameStatistics };