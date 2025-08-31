import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { walletAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { DollarSign, IndianRupee } from 'lucide-react';
import { formatIndianCurrency } from '../../services/IndianCurrencyFormatter';
import LoadingSpinner from '../LoadingSpinner';

const Wallet = () => {
  const { user, refreshUserData } = useAuth();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleDeposit = async () => {
    if (!depositAmount || isNaN(depositAmount) || depositAmount <= 0) {
      toast.error('Please enter a valid deposit amount');
      return;
    }

    try {
      setLoading(true);
      await walletAPI.deposit(parseFloat(depositAmount));
      await refreshUserData();
      toast.success('Deposit successful!');
      setDepositAmount('');
      const transactionData = await walletAPI.getTransactions();
      setTransactions(transactionData);
    } catch (error) {
      console.error('Deposit failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast.error('Please enter a valid withdrawal amount');
      return;
    }

    try {
      setLoading(true);
      await walletAPI.withdraw(parseFloat(withdrawAmount));
      await refreshUserData();
      toast.success('Withdrawal successful!');
      setWithdrawAmount('');
      const transactionData = await walletAPI.getTransactions();
      setTransactions(transactionData);
    } catch (error) {
      console.error('Withdrawal failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Wallet</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Balance: {formatIndianCurrency(user?.balance) || 0}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deposit Amount</label>
                <div className="flex items-center space-x-4">
                  <input
                      type="text"
                      value={depositAmount}
                      onChange={(e) => {
                          const newValue = e.target.value;
                          // Allow empty string or a valid number (with optional decimal point)
                          if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
                              setDepositAmount(newValue);
                          }
                      }}
                      className="block w-50 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Amount"
                  />
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    onClick={handleDeposit}
                    disabled={loading}
                  >
                    Deposit
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Withdraw Amount</label>
                <div className="flex items-center space-x-4">
                  <input
                      type="text"
                      value={withdrawAmount}
                      onChange={(e) => {
                          const newValue = e.target.value;
                          // Allow empty string or a valid number (with optional decimal point)
                          if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
                              setWithdrawAmount(newValue);
                          }
                      }}
                      className="block w-50 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Amount"
                  />
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    onClick={handleWithdraw}
                    disabled={loading}
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
            {transactions.length === 0 ? (
              <p className="text-gray-600">
                No transactions yet.
                </p>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between border-b py-2">
                    <div className="flex items-center">
                      <IndianRupee className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{tx.type}</p>
                        <p className="text-sm text-gray-600">{new Date(tx.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-semibold ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}{formatIndianCurrency(tx.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;