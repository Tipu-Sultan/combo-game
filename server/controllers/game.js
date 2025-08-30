const gameService = require('../services/game');

const getGames = async (req, res) => {
  try {
    const games = await gameService.getActiveGames();
    res.json(games);
  } catch (error) {
    console.error('Games fetch error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const playGame = async (req, res) => {
  try {
    const { gameId, betAmount } = req.body;
    const result = await gameService.playGame(req.user.userId, gameId, betAmount);
    res.json(result);
  } catch (error) {
    console.error('Game play error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getGames, playGame };