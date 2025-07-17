import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LevelGrid from '../components/LevelGrid';
import { Zap, Award, Clock } from 'lucide-react';

const FunThinkerHardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLevelClick = (level: number) => {
    // For demo purposes, navigate to tangles playground
    navigate(`/tangles/play/${level}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mb-4">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Hard Level</h1>
          <p className="text-xl text-gray-600 mb-6">
            Ultimate challenges for puzzle masters
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">Expert-level puzzles</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Time challenges</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Zap className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">Maximum difficulty</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Hard Puzzles</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4" />
                <span>20 levels total</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>High difficulty</span>
              </div>
            </div>
          </div>

          <LevelGrid 
            category="funthinker-hard" 
            totalLevels={20} 
            onLevelClick={handleLevelClick} 
          />
        </div>
      </main>
    </div>
  );
};

export default FunThinkerHardPage;