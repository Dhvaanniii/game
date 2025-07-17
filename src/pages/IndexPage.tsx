import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Puzzle, Users, Trophy } from 'lucide-react';

const IndexPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center animate-fadeIn">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Brain className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Puzzle<span className="text-yellow-300">Game</span>
            </h1>
            <p className="text-xl text-white opacity-90 mb-8">
              Challenge your mind with engaging puzzles and brain teasers
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Sign Up
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 text-center">
              <Puzzle className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Fun Puzzles</h3>
              <p className="text-white opacity-80">
                Solve engaging puzzles with increasing difficulty levels
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Earn Stars</h3>
              <p className="text-white opacity-80">
                Get up to 3 stars based on your performance
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 text-center">
              <Users className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Track Progress</h3>
              <p className="text-white opacity-80">
                Monitor your improvement and unlock new levels
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;