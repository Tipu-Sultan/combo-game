const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const { authenticateToken } = require('../middleware/auth');

router.post('/games', authenticateToken, adminController.createGame);

module.exports = router;