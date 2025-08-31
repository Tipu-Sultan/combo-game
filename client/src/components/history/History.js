import React, { useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Clock, DollarSign, Trophy, PlayCircle, IndianRupee } from 'lucide-react';
import { walletAPI } from '../../services/api';
import { formatIndianCurrency } from '../../services/IndianCurrencyFormatter';
import LoadingSpinner from '../LoadingSpinner';

const History = () => {
  const { loading } = useGame();
  const [transactions, setTransactions] = React.useState([]);
  const [gameStatistics, setGameStatistics] = React.useState([]);


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionData = await walletAPI.getTransactions();
        setTransactions(transactionData);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchGameStatistics = async () => {
      try {
        const gameStatisticsData = await walletAPI.getGameStatistics();
        setGameStatistics(gameStatisticsData);
      } catch (error) {
        console.error('Failed to fetch gameStatistics:', error);
      }
    };
    fetchGameStatistics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6 font-bebas">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">Transaction & Game History</h1>

        {/* Game Statistics Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Game Statistics</h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : gameStatistics?.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-gray-600">
                No game statistics available.
                <LoadingSpinner/>
                </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gameStatistics?.map((stat) => (
                <div key={stat.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-2">{stat.game_icon}</span>
                    <h3 className="text-xl font-semibold text-gray-900">{stat.game_name}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <p>Total Plays: {stat.total_plays}</p>
                    <p>Total Wagered: ₹{Number(stat.total_wagered).toFixed(2)}</p>
                    <p>Total Won: ₹{Number(stat.total_won).toFixed(2)}</p>
                    <p>Total Lost: ₹{Number(stat.total_lost).toFixed(2)}</p>
                    <p>Biggest Win: ₹{Number(stat.biggest_win).toFixed(2)}</p>
                    <p>Longest Streak: {stat.longest_streak}</p>
                    <p>Last Played: {new Date(stat.last_played).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transaction History Section */}
        <h2 className="text-2xl font-semibold text-white mb-4">Transaction History</h2>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600">
              No transactions yet.
                <LoadingSpinner/>
              </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between border-b py-2">
                  <div className="flex items-center">
                    {tx.game_icon && <span className="text-xl mr-2">{tx.game_icon}</span>}
                    <div>
                      <p className="text-sm font-medium text-gray-900 flex items-center">
                        {tx.type === 'game_win' && <Trophy className="h-5 w-5 text-yellow-600 mr-1" />}
                        {tx.type === 'game_loss' && <PlayCircle className="h-5 w-5 text-red-600 mr-1" />}
                        {tx.type === 'deposit' && <IndianRupee className="h-5 w-5 text-green-600 mr-1" />}
                        {tx.type === 'withdrawal' && <IndianRupee className="h-5 w-5 text-red-600 mr-1" />}
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} {tx.game_name ? `(${tx.game_name})` : ''}
                      </p>
                      <p className="text-sm text-gray-600">{tx.description}</p>
                      <p className="text-sm text-gray-600">Status: {tx.status}</p>
                      <p className="text-sm text-gray-600">Ref ID: {tx.reference_id || 'N/A'}</p>
                      <p className="text-sm text-gray-600">{new Date(tx.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      tx.type === 'deposit' || tx.type === 'game_win' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {tx.type === 'deposit' || tx.type === 'game_win' ? '+' : '-'}{formatIndianCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;