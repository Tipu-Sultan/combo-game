import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Home, Gamepad, Wallet, Clock, User } from 'lucide-react';

const Layout = () => {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">Gaming Platform</span>
            </div>
            <div className="flex items-center space-x-4">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-blue-700' : 'hover:bg-blue-500'
                  }`
                }
              >
                <Home className="h-5 w-5 mr-1" />
                Dashboard
              </NavLink>
              <NavLink
                to="/games"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-blue-700' : 'hover:bg-blue-500'
                  }`
                }
              >
                <Gamepad className="h-5 w-5 mr-1" />
                Games
              </NavLink>
              <NavLink
                to="/wallet"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-blue-700' : 'hover:bg-blue-500'
                  }`
                }
              >
                <Wallet className="h-5 w-5 mr-1" />
                Wallet
              </NavLink>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-blue-700' : 'hover:bg-blue-500'
                  }`
                }
              >
                <Clock className="h-5 w-5 mr-1" />
                History
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-blue-700' : 'hover:bg-blue-500'
                  }`
                }
              >
                <User className="h-5 w-5 mr-1" />
                Profile
              </NavLink>
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;