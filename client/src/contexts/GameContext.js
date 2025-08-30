import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { gamesAPI } from '../services/api';
import toast from 'react-hot-toast';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const { user, refreshUserData } = useAuth();
  const [games, setGames] = useState([]);
  const [betAmount, setBetAmount] = useState('');
  const [isBetSet, setIsBetSet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [result, setResult] = useState(null);
  const [reels, setReels] = useState(['?', '?', '?']);
  const [spinning, setSpinning] = useState(false);

  const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '🔔', '⭐'];

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gameData = await gamesAPI.getGames();
        setGames(gameData);
      } catch (error) {
        console.error('Failed to fetch games:', error);
        toast.error('Failed to load games');
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const validateBet = (amount, gameId) => {
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount)) {
      toast.error('Please enter a valid bet amount');
      return false;
    }
    const game = games.find((g) => g.id === gameId);
    if (!game || !game.active) {
      toast.error('Selected game is not available');
      return false;
    }
    if (numAmount < game.min_bet) {
      toast.error(`Bet amount must be at least ₹${Number(game.min_bet).toFixed(2)} for ${game.name}`);
      return false;
    }
    if (numAmount > game.max_bet) {
      toast.error(`Bet amount cannot exceed ₹${Number(game.max_bet).toFixed(2)} for ${game.name}`);
      return false;
    }
    if (numAmount > (user?.balance ? Number(user.balance) : 0)) {
      toast.error('Insufficient balance');
      return false;
    }
    return true;
  };

  const handleSetBet = () => {
    // Check if bet is valid for at least one active game
    const validForAnyGame = games.some(
      (game) =>
        game.active &&
        parseFloat(betAmount) >= game.min_bet &&
        parseFloat(betAmount) <= game.max_bet &&
        parseFloat(betAmount) <= (user?.balance ? Number(user.balance) : 0)
    );
    if (validForAnyGame) {
      setIsBetSet(true);
      toast.success('Bet amount set successfully!');
    } else {
      setIsBetSet(false);
      toast.error('Bet amount is not valid for any active game');
    }
  };

  const getValidGames = () => {
    if (!isBetSet || !betAmount) return [];
    const numAmount = parseFloat(betAmount);
    return games.filter(
      (game) =>
        game.active &&
        numAmount >= game.min_bet &&
        numAmount <= game.max_bet &&
        numAmount <= (user?.balance ? Number(user.balance) : 0)
    );
  };

  const playGame = async (gameId) => {
    if (!isBetSet) {
      toast.error('Please set a valid bet amount first');
      return;
    }
    if (!validateBet(betAmount, gameId)) return;

    setPlaying(true);
    setSelectedGame(gameId);
    setResult(null);
    setSpinning(true);

    // Simulate spinning animation
    const spinDuration = 2000; // 2 seconds
    const interval = 100; // Update every 100ms
    let elapsed = 0;

    const spinInterval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ]);
      elapsed += interval;
      if (elapsed >= spinDuration) {
        clearInterval(spinInterval);
        finishSpin(gameId);
      }
    }, interval);
  };

  const finishSpin = async (gameId) => {
    try {
      const response = await gamesAPI.playGame(gameId, parseFloat(betAmount));
      await refreshUserData();
      setResult(response);
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ]);
      setSpinning(false);
      setIsBetSet(false); // Reset bet after playing
      setBetAmount('');
      toast.success(response.message);
    } catch (error) {
      console.error('Failed to play game:', error);
      toast.error(error.response?.data?.error || 'Game play failed');
      setSpinning(false);
      setIsBetSet(false);
      setBetAmount('');
    }
  };

  const closeGame = () => {
    setPlaying(false);
    setSelectedGame(null);
    setResult(null);
    setReels(['?', '?', '?']);
    setBetAmount('');
    setIsBetSet(false);
  };

  return (
    <GameContext.Provider
      value={{
        games,
        betAmount,
        setBetAmount,
        isBetSet,
        handleSetBet,
        loading,
        playing,
        selectedGame,
        result,
        reels,
        spinning,
        playGame,
        closeGame,
        getValidGames,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};