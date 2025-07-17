import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { apiService } from '../services/api';
import { Star, Lock, Play, Clock, Calendar } from 'lucide-react';

interface LevelGridProps {
  category: string;
  totalLevels: number;
  onLevelClick: (level: number) => void;
}

interface StoredLevel {
  levelNumber: number;
  pageNumber: number;
  category: string;
  outlineUrl: string;
  unlockDate: string;
  lockDate: string;
  uploadDate: string;
  hasBeenPlayed: boolean;
}

const LevelGrid: React.FC<LevelGridProps> = ({ category, totalLevels, onLevelClick }) => {
  const { isLevelUnlocked, getLevelProgress } = useGame();
  const [availableLevels, setAvailableLevels] = useState<StoredLevel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAvailableLevels();
  }, [category]);

  const loadAvailableLevels = () => {
    setLoading(true);
    try {
      apiService.getLevelsByCategory(category)
        .then(response => {
          if (response.success) {
            const levels = response.levels.map((level: any) => ({
              levelNumber: level.levelNumber,
              pageNumber: level.pageNumber,
              category: level.category,
              outlineUrl: level.outlineUrl,
              unlockDate: level.unlockDate,
              lockDate: level.lockDate,
              uploadDate: level.uploadDate,
              hasBeenPlayed: level.hasBeenPlayed
            }));
            setAvailableLevels(levels.sort((a, b) => a.levelNumber - b.levelNumber));
          } else {
            setAvailableLevels([]);
          }
        })
        .catch(error => {
          console.error('Error loading levels:', error);
          setAvailableLevels([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error('Error loading levels:', error);
      setAvailableLevels([]);
      setLoading(false);
    }
  };

  const isLevelAvailable = (levelNumber: number): boolean => {
    const level = availableLevels.find(l => l.levelNumber === levelNumber);
    if (!level) return false;

    const now = new Date();
    const unlockDate = new Date(level.unlockDate);
    const lockDate = new Date(level.lockDate);

    // Check if level is unlocked and not permanently locked
    return now >= unlockDate && (level.hasBeenPlayed || now <= lockDate);
  };

  const getLevelStatus = (levelNumber: number): 'locked' | 'available' | 'completed' | 'expired' => {
    const level = availableLevels.find(l => l.levelNumber === levelNumber);
    if (!level) return 'locked';

    const now = new Date();
    const unlockDate = new Date(level.unlockDate);
    const lockDate = new Date(level.lockDate);

    if (level.hasBeenPlayed) return 'completed';
    if (now < unlockDate) return 'locked';
    if (now > lockDate) return 'expired';
    return 'available';
  };

  const getDaysUntilUnlock = (levelNumber: number): number => {
    const level = availableLevels.find(l => l.levelNumber === levelNumber);
    if (!level) return 0;

    const now = new Date();
    const unlockDate = new Date(level.unlockDate);
    const diffTime = unlockDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const getDaysUntilLock = (levelNumber: number): number => {
    const level = availableLevels.find(l => l.levelNumber === levelNumber);
    if (!level || level.hasBeenPlayed) return 0;

    const now = new Date();
    const lockDate = new Date(level.lockDate);
    const diffTime = lockDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const renderStars = (stars: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < stars ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-300 bg-green-50';
      case 'available': return 'border-blue-300 bg-white hover:border-blue-500 hover:shadow-lg';
      case 'locked': return 'border-gray-300 bg-gray-100';
      case 'expired': return 'border-red-300 bg-red-50';
      default: return 'border-gray-300 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string, levelNumber: number) => {
    switch (status) {
      case 'completed':
        return <Play className="w-5 h-5 text-green-500" />;
      case 'available':
        return <Play className="w-5 h-5 text-blue-500" />;
      case 'locked':
        return (
          <div className="flex flex-col items-center">
            <Lock className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">
              {getDaysUntilUnlock(levelNumber)}d
            </span>
          </div>
        );
      case 'expired':
        return <Clock className="w-5 h-5 text-red-500" />;
      default:
        return <Lock className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading levels...</span>
      </div>
    );
  }

  if (availableLevels.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">No Levels Available</h3>
        <p className="text-gray-500">
          No levels have been uploaded for this category yet. 
          Please contact your administrator to add new levels.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Level Statistics */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {availableLevels.length}
            </div>
            <div className="text-sm text-gray-600">Total Levels</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {availableLevels.filter(l => l.hasBeenPlayed).length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {availableLevels.filter(l => getLevelStatus(l.levelNumber) === 'available').length}
            </div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {availableLevels.filter(l => getLevelStatus(l.levelNumber) === 'expired').length}
            </div>
            <div className="text-sm text-gray-600">Expired</div>
          </div>
        </div>
      </div>

      {/* Level Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {availableLevels.map(level => {
          const levelId = `${category}-${level.levelNumber}`;
          const status = getLevelStatus(level.levelNumber);
          const progress = getLevelProgress(levelId);
          const isClickable = status === 'available' || status === 'completed';
          const daysUntilLock = getDaysUntilLock(level.levelNumber);
          
          return (
            <div
              key={level.levelNumber}
              className={`
                relative aspect-square rounded-xl border-2 transition-all duration-300 cursor-pointer
                ${getStatusColor(status)}
                ${isClickable ? 'transform hover:scale-105' : 'cursor-not-allowed opacity-75'}
              `}
              onClick={() => isClickable && onLevelClick(level.levelNumber)}
              title={
                status === 'locked' 
                  ? `Unlocks in ${getDaysUntilUnlock(level.levelNumber)} days`
                  : status === 'expired'
                  ? 'This level has expired'
                  : status === 'available' && daysUntilLock > 0
                  ? `${daysUntilLock} days left to play`
                  : ''
              }
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                {getStatusIcon(status, level.levelNumber)}
                
                <span className={`text-sm font-bold mt-1 ${
                  status === 'completed' ? 'text-green-700' :
                  status === 'available' ? 'text-blue-700' :
                  status === 'expired' ? 'text-red-700' :
                  'text-gray-500'
                }`}>
                  {level.levelNumber}
                </span>
                
                {progress && progress.completed && (
                  <div className="flex space-x-1 mt-1">
                    {renderStars(progress.stars)}
                  </div>
                )}

                {status === 'available' && daysUntilLock > 0 && daysUntilLock <= 3 && (
                  <div className="text-xs text-orange-600 mt-1 font-medium">
                    {daysUntilLock}d left
                  </div>
                )}
              </div>
              
              {progress && progress.completed && (
                <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full"></div>
              )}

              {status === 'expired' && (
                <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-3">Level Status Legend:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Available to Play</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            <span>Locked (Future)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Expired</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelGrid;