import React from "react";
import { useGame } from "../../contexts/GameContext";
import { useAuth } from "../../contexts/AuthContext";
import { Gamepad, DollarSign, IndianRupeeIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatIndianCurrency } from "../../services/IndianCurrencyFormatter";

const Games = () => {
  const { user } = useAuth();
  const {
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
  } = useGame();
  const validGames = getValidGames();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6 font-bebas">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">Available Games</h1>

        <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
              <IndianRupeeIcon className="h-6 w-6 text-blue-600 mr-2" />
              Balance:{" "}
              {user?.balance ? formatIndianCurrency(user.balance) : "0.00"}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={betAmount}
              onChange={(e) => {
                const newValue = e.target.value;
                // Allow empty string or a valid number (with optional decimal point)
                if (newValue === "" || /^\d*\.?\d*$/.test(newValue)) {
                  setBetAmount(newValue);
                }
              }}
              className="block w-50 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-bebas text-lg"
              placeholder="Enter bet amount"
            />
            <button
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 font-bebas text-lg"
              onClick={handleSetBet}
              disabled={loading || spinning}
            >
              {loading || spinning ? "Processing..." : "Set Bet"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : validGames.length === 0 && isBetSet ? (
          <p className="text-white text-lg">
            No games available for the current bet amount.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {validGames.map((game) => (
              <div
                key={game.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-2">{game.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {game.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{game.description}</p>
                <p className="text-sm text-gray-600">
                  Bet Range: {formatIndianCurrency(game.min_bet)} -{" "}
                  {formatIndianCurrency(game.max_bet)}
                </p>
                <button
                  className="w-full px-4 py-2 mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 font-bebas text-lg"
                  onClick={() => playGame(game.id)}
                  disabled={loading || spinning || !isBetSet}
                >
                  Play Now
                </button>
              </div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {playing && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-lg p-8 max-w-lg w-full"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6 font-bebas">
                  {validGames.find((g) => g.id === selectedGame)?.name ||
                    "Game"}
                </h2>
                <div className="flex justify-center space-x-4 mb-6">
                  {reels.map((symbol, index) => (
                    <motion.div
                      key={index}
                      className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-4xl text-white"
                      animate={{
                        y: spinning ? [0, -20, 0] : 0,
                        transition: spinning
                          ? { repeat: Infinity, duration: 0.2 }
                          : { duration: 0.3 },
                      }}
                    >
                      {symbol}
                    </motion.div>
                  ))}
                </div>
                {result && (
                  <div className="text-center mb-6">
                    <p className="text-2xl font-semibold text-gray-900">
                      {result.message ||
                        (result.won ? "You won!" : "You lost!")}
                    </p>
                    {result.winAmount > 0 && (
                      <p
                        className={
                          result.won
                            ? `text-xl text-green-600`
                            : `text-xl text-red-600`
                        }
                      >
                        {result.won
                          ? "Winnings: " +
                            formatIndianCurrency(result.winAmount)
                          : "Losings: " +
                            formatIndianCurrency(result.winAmount)}
                      </p>
                    )}
                    <p className="text-lg text-gray-600">
                      New Balance: {formatIndianCurrency(result.newBalance)}
                    </p>
                  </div>
                )}
                <button
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-bebas text-lg"
                  onClick={closeGame}
                  disabled={spinning}
                >
                  {spinning ? "Spinning..." : "Close"}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Games;
