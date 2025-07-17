import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Coins, LogOut, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <header className="bg-white shadow-lg border-b-4 border-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={user.userType === 'admin' ? '/admin' : '/home'} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-gray-800">PuzzleGame</span>
          </Link>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
              <Coins className="w-4 h-4 text-yellow-600" />
              <span className="font-semibold text-yellow-800">{user.coins}</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-700">
              <User className="w-4 h-4" />
              <div className="flex flex-col">
                <span className="font-medium">{user.username}</span>
                <span className="text-xs text-gray-500">{user.userType === 'admin' ? 'Administrator' : 'Player'}</span>
              </div>
            </div>

            {user.userType === 'user' && (
              <Link 
                to="/profile" 
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Edit Profile</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;