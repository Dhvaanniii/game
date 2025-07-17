import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Brain, Target, Zap, Award } from 'lucide-react';

const FunThinkerPage: React.FC = () => {
  const categories = [
    {
      id: 'basic',
      title: 'Basic Level',
      description: 'Perfect for beginners and warming up',
      icon: Target,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      path: '/funthinkers/basic'
    },
    {
      id: 'medium',
      title: 'Medium Level', 
      description: 'Challenging puzzles for growing minds',
      icon: Brain,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-50',
      path: '/funthinkers/medium'
    },
    {
      id: 'hard',
      title: 'Hard Level',
      description: 'Ultimate challenges for puzzle masters',
      icon: Zap,
      color: 'from-red-500 to-pink-600',
      bgColor: 'from-red-50 to-pink-50',
      path: '/funthinkers/hard'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Funthinkers</h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose your difficulty level and start training your brain!
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">Progressive difficulty</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Brain className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Brain training exercises</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Target className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Skill development</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.id}
                to={category.path}
                className="group"
              >
                <div className={`bg-gradient-to-br ${category.bgColor} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform group-hover:scale-105`}>
                  <div className={`bg-gradient-to-r ${category.color} p-6`}>
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-gray-700" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white text-center mb-2">
                      {category.title}
                    </h2>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 text-center mb-6">
                      {category.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total Levels:</span>
                        <span className="font-semibold text-gray-800">20</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Completed:</span>
                        <span className="font-semibold text-gray-800">0</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gray-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <span className="inline-flex items-center px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-md">
                        Start Playing →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            How Funthinkers Work
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Choose Level</h4>
              <p className="text-sm text-gray-600">
                Select your difficulty level based on your current skills
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-xl">2</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Solve Puzzles</h4>
              <p className="text-sm text-gray-600">
                Complete brain training exercises at your own pace
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-xl">3</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Progress</h4>
              <p className="text-sm text-gray-600">
                Unlock new levels as you improve your skills
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FunThinkerPage;