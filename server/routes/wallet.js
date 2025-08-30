const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet');
const { authenticateToken } = require('../middleware/auth');

router.get('/transactions', authenticateToken, walletController.getTransactions);
router.post('/deposit', authenticateToken, walletController.deposit);
router.post('/withdraw', authenticateToken, walletController.withdraw);
router.get('/game-statistics', authenticateToken, walletController.getGameStatistics);

module.exports = router;