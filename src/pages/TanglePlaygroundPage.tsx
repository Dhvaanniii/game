import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import TangleGameplay from '../components/TangleGameplay';
import { Play, Pause, RotateCcw, Home, Star, Trophy } from 'lucide-react';

const TanglePlaygroundPage: React.FC = () => {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const { updateProgress, unlockNextLevel } = useGame();
  const { addCoins } = useAuth();
  
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isPlaying, setIsPlaying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [stars, setStars] = useState(0);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      handleAttemptFailed();
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimeLeft(300);
    setAttempts(0);
    setGameCompleted(false);
    setShowResult(false);
    setStars(0);
    setPoints(0);
  };

  const handleGameComplete = (attemptNumber: number, timeUsed: number, earnedPoints: number) => {
    setIsPlaying(false);
    setGameCompleted(true);
    
    setAttempts(attemptNumber);
    setPoints(earnedPoints);
    
    // Calculate stars based on attempts
    let earnedStars = 0;
    if (attemptNumber === 1) earnedStars = 3;
    else if (attemptNumber === 2) earnedStars = 2;
    else if (attemptNumber === 3) earnedStars = 1;
    
    setStars(earnedStars);
    
    // Update progress
    const levelId = `tangle-${level}`;
    updateProgress(levelId, earnedStars, attemptNumber);
    unlockNextLevel(levelId, 'tangle');
    
    // Add coins based on points
    addCoins(earnedPoints);
    
    setShowResult(true);
  };

  const handleAttemptFailed = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    if (newAttempts >= 3) {
      // Game over after 3 attempts
      setGameCompleted(true);
      setStars(0);
      setPoints(0);
      setShowResult(true);
    } else {
      // Reset for next attempt
      setTimeLeft(300);
      setIsPlaying(false);
    }
  };
  const handleNextLevel = () => {
    const nextLevel = parseInt(level!) + 1;
    if (nextLevel <= 200) {
      navigate(`/tangles/play/${nextLevel}`);
      setShowResult(false);
      setGameCompleted(false);
      setAttempts(0);
      setStars(0);
      setPoints(0);
      setTimeLeft(300);
    } else {
      navigate('/tangles');
    }
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <Star
        key={i}
        className={`w-8 h-8 ${i < count ? 'text-yellow-500 fill-current' : 'text-gray-300'} star-animation`}
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Tangle Level {level}
          </h1>
          <div className="flex items-center justify-center space-x-6 text-lg">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Time:</span>
              <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-800'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Attempts:</span>
              <span className="font-bold text-gray-800">{attempts}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <TangleGameplay 
            level={parseInt(level!)} 
            category="tangle"
            onComplete={handleGameComplete}
            onAttemptFailed={handleAttemptFailed}
            isPlaying={isPlaying}
            currentAttempt={attempts + 1}
            timeLeft={timeLeft}
            onGameStart={handleStart}
          />
        </div>

        {/* Game Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-center space-x-4">
            {!isPlaying ? (
              <button
                onClick={handleStart}
                disabled={gameCompleted}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                <Play className="w-5 h-5" />
                <span>Start Game</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => navigate('/tangles')}
              className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Back to Levels</span>
            </button>
          </div>
        </div>

        {/* Result Modal */}
        {showResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center animate-fadeIn">
              <div className="mb-6">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {gameCompleted ? 'Puzzle Completed!' : 'Time\'s Up!'}
                </h2>
                <p className="text-gray-600">
                  You completed the puzzle in {attempts} attempt{attempts !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex justify-center space-x-1 mb-2">
                  {renderStars(stars)}
                </div>
                <p className="text-sm text-gray-600">
                  You earned {stars} star{stars !== 1 ? 's' : ''} and {points} coins!
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => navigate('/tangles')}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  Back to Levels
                </button>
                <button
                  onClick={handleNextLevel}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  Next Level
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TanglePlaygroundPage;