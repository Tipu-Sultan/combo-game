const gameModel = require('../models/game');

const createGame = async (req, res) => {
  try {
    const gameData = req.body;
    const result = await gameModel.createGame(gameData);
    res.status(201).json({ success: true, message: 'Game created successfully', gameId: result.id });
  } catch (error) {
    console.error('Create game error:', error.message);
    res.status(500).json({ error: 'Failed to create game' });
  }
};

module.exports = { createGame };