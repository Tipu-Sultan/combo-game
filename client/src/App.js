import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Games from './components/games/Games';
import Wallet from './components/wallet/Wallet';
import History from './components/history/History';
import Profile from './components/profile/Profile';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

function AppRoutes() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
        />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="games" element={<Games />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="history" element={<History />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            fontFamily: 'Bebas Neue, sans-serif',
            borderRadius: '8px',
            padding: '12px 16px',
          },
          success: {
            duration: 3000,
            style: {
              border: '1px solid #4aed88',
            },
          },
          error: {
            duration: 4000,
            style: {
              border: '1px solid #f56565',
            },
          },
        }}
      />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <div className="min-h-screen font-bebas">
          <AppRoutes />
        </div>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;