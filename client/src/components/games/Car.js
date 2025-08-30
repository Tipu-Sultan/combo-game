import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Car, Trophy, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CarGame = ({ game }) => {
  const {
    betAmount,
    setBetAmount,
    targetLevel,
    setTargetLevel,
    isBetSet,
    handleSetBet,
    playGame,
    playing,
    selectedGame,
    result,
    reels,
    spinning,
    closeGame,
  } = useGame();

  const [animationProgress, setAnimationProgress] = useState(0);

  const handlePlay = () => {
    if (!isBetSet) {
      toast.error('Please set a valid bet and target level');
      return;
    }
    playGame(game.id);
  };

  const renderAnimation = () => {
    if (!spinning && result) {
      return (
        <div className="text-center">
          <div className="text-4xl mb-4">{reels[1]}</div>
          <p className="text-lg text-gray-200">
            {result.won ? `You won ₹${Number(result.winAmount).toFixed(2)}!` : `You lost ₹${Number(result.betAmount).toFixed(2)}`}
          </p>
          <p className="text-lg text-gray-200">Levels: {reels[2]}</p>
        </div>
      );
    }
    return (
      <div className="relative h-16 bg-gray-700 rounded-lg overflow-hidden">
        <div
          className="absolute top-2 left-0 h-12 w-12 text-4xl transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(${animationProgress * 30}px)` }}
        >
          {reels[0]}
        </div>
        <div className="absolute inset-0 flex items-center justify-between px-4 text-gray-400">
          {Array.from({ length: 11 }, (_, i) => (
            <span key={i} className="text-sm">{i + 1}</span>
          ))}
        </div>
      </div>
    );
  };

  React.useEffect(() => {
    if (spinning && selectedGame === game.id) {
      const interval = setInterval(() => {
        setAnimationProgress((prev) => {
          const next = prev + 0.1;
          if (next >= (result?.levelsCrossed || 11)) {
            clearInterval(interval);
            return prev;
          }
          return next;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [spinning, selectedGame, result, game.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-lg p-6 max-w-md w-full font-bebas text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{game.name}</h2>
          <button onClick={closeGame} className="text-gray-300 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-300">{game.description}</p>
          <p className="text-sm text-gray-300">
            Bet Range: ₹{Number(game.min_bet).toFixed(2)} - ₹{Number(game.max_bet).toFixed(2)}
          </p>
        </div>

        {!playing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bet Amount (₹)</label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bebas text-lg"
                placeholder="Enter bet amount"
                min={game.min_bet}
                max={game.max_bet}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Target Level (1–11)</label>
              <input
                type="number"
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bebas text-lg"
                placeholder="Select target level"
                min="1"
                max="11"
              />
            </div>
            <button
              onClick={handleSetBet}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-bebas text-lg"
            >
              Set Bet
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {renderAnimation()}
            {result && (
              <button
                onClick={closeGame}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-bebas text-lg"
              >
                Close
              </button>
            )}
          </div>
        )}

        {isBetSet && !playing && (
          <button
            onClick={handlePlay}
            className="w-full py-3 mt-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-bebas text-lg flex items-center justify-center"
          >
            <Car className="h-5 w-5 mr-2" />
            Play Now
          </button>
        )}
      </div>
    </div>
  );
};

export default CarGame;