const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game');
const { authenticateToken } = require('../middleware/auth');

router.get('/', gameController.getGames);
router.post('/play', authenticateToken, gameController.playGame);

module.exports = router;