import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { DollarSign, Trophy, PlayCircle, IndianRupeeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatIndianCurrency } from '../../services/IndianCurrencyFormatter';

const Dashboard = () => {
  const { user } = useAuth();
  const { games, loading } = useGame();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6 font-bebas">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">Welcome, {user?.name || 'User'}!</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <IndianRupeeIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Wallet Balance</p>
                <p className="text-2xl font-semibold text-gray-900">{user?.balance ? formatIndianCurrency(user?.balance) : '0.00'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Winnings</p>
                <p className="text-2xl font-semibold text-gray-900">{user?.total_winnings ? formatIndianCurrency(user.total_winnings) : '0.00'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <PlayCircle className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Games Played</p>
                <p className="text-2xl font-semibold text-gray-900">{user?.games_played || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-white mb-4">Available Games</h2>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <div key={game.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-2">{game.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-900">{game.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{game.description}</p>
                <p className="text-sm text-gray-600">
                  Bet Range: {formatIndianCurrency(game.min_bet)} - {Number(game.max_bet)}
                </p>
                <button
                  className="w-full px-4 py-2 mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-bebas text-lg"
                  onClick={() => navigate('/games')}
                >
                  Play Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;