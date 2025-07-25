import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LevelGrid from '../components/LevelGrid';
import { Brain, Award, Clock } from 'lucide-react';

const FunThinkerMediumPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLevelClick = (level: number) => {
    // For demo purposes, navigate to tangrams playground
    navigate(`/tangrams/play/${level}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mb-4">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Medium Level</h1>
          <p className="text-xl text-gray-600 mb-6">
            Challenging puzzles for growing minds
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">Intermediate challenges</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Moderate time limits</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Brain className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Skill building</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Medium Puzzles</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Brain className="w-4 h-4" />
                <span>20 levels total</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>Medium difficulty</span>
              </div>
            </div>
          </div>

          <LevelGrid 
            category="funthinker-medium" 
            totalLevels={20} 
            onLevelClick={handleLevelClick} 
          />
        </div>
      </main>
    </div>
  );
};

export default FunThinkerMediumPage;