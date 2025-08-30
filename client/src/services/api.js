import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    const errorMessage = error.response?.data?.error || 'An unexpected error occurred';
    toast.error(errorMessage);
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/user/profile', userData);
    return response.data;
  }
};

// Games API
export const gamesAPI = {
  getGames: async () => {
    const response = await api.get('/games');
    return response.data;
  },

  playGame: async (gameId, betAmount,targetLevel) => {
    const response = await api.post('/games/play', { gameId, betAmount });
    return response.data;
  }
};

// Wallet API
export const walletAPI = {
  deposit: async (amount) => {
    const response = await api.post('/wallet/deposit', { amount });
    return response.data;
  },

  withdraw: async (amount) => {
    const response = await api.post('/wallet/withdraw', { amount });
    return response.data;
  },

  getTransactions: async () => {
    const response = await api.get('/wallet/transactions');
    return response.data;
  },
  getGameStatistics: async () => {
    const response = await api.get('/wallet/game-statistics');
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  createGame: async (gameData) => {
    const response = await api.post('/admin/games', gameData);
    return response.data;
  },

  updateGame: async (gameId, gameData) => {
    const response = await api.put(`/admin/games/${gameId}`, gameData);
    return response.data;
  },

  deleteGame: async (gameId) => {
    const response = await api.delete(`/admin/games/${gameId}`);
    return response.data;
  }
};

export default api;