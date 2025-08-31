import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Home, Gamepad, Wallet, Clock, User, Menu, X } from 'lucide-react';

const Layout = () => {
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/games', label: 'Games', icon: Gamepad },
    { to: '/wallet', label: 'Wallet', icon: Wallet },
    { to: '/history', label: 'History', icon: Clock },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center">
              <span className="text-xl font-bold">Gaming Platform</span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-4">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive ? 'bg-blue-700' : 'hover:bg-blue-500'
                    }`
                  }
                >
                  <Icon className="h-5 w-5 mr-1" />
                  {label}
                </NavLink>
              ))}
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-md hover:bg-blue-500 focus:outline-none"
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-blue-700 space-y-1 px-2 pt-2 pb-3">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-blue-800' : 'hover:bg-blue-600'
                  }`
                }
              >
                <Icon className="h-5 w-5 mr-2" />
                {label}
              </NavLink>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                logout();
              }}
              className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
