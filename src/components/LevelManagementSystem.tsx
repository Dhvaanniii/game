import React, { useState, useEffect } from 'react';
import { Clock, Lock, Unlock, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

interface ManagedLevel {
  id: string;
  number: number;
  category: 'tangle' | 'funthinker-basic' | 'funthinker-medium' | 'funthinker-hard';
  unlockDate: Date;
  lockDate: Date;
  isLocked: boolean;
  isUnlocked: boolean;
  daysUntilLock: number;
  hasBeenPlayed: boolean;
}

const LevelManagementSystem: React.FC = () => {
  const [levels, setLevels] = useState<ManagedLevel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadLevels();
    
    // Check level status every minute
    const interval = setInterval(checkLevelStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadLevels = () => {
    const categories = ['tangle', 'funthinker-basic', 'funthinker-medium', 'funthinker-hard'];
    const allLevels: ManagedLevel[] = [];

    categories.forEach(category => {
      const stored = localStorage.getItem(`${category}-levels`);
      if (stored) {
        const categoryLevels = JSON.parse(stored);
        categoryLevels.forEach((level: any, index: number) => {
          const unlockDate = new Date(level.unlockDate || Date.now());
          const lockDate = new Date(unlockDate.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 days after unlock
          const now = new Date();
          
          const isUnlocked = now >= unlockDate;
          const isLocked = now > lockDate && !level.hasBeenPlayed;
          const daysUntilLock = Math.max(0, Math.ceil((lockDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));

          allLevels.push({
            id: `${category}-${index + 1}`,
            number: index + 1,
            category: category as any,
            unlockDate,
            lockDate,
            isLocked,
            isUnlocked,
            daysUntilLock,
            hasBeenPlayed: level.hasBeenPlayed || false,
          });
        });
      }
    });

    setLevels(allLevels);
  };

  const checkLevelStatus = () => {
    const now = new Date();
    
    setLevels(prevLevels => 
      prevLevels.map(level => {
        const isUnlocked = now >= level.unlockDate;
        const isLocked = now > level.lockDate && !level.hasBeenPlayed;
        const daysUntilLock = Math.max(0, Math.ceil((level.lockDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));

        return {
          ...level,
          isUnlocked,
          isLocked,
          daysUntilLock,
        };
      })
    );
  };

  const unlockLevel = (levelId: string) => {
    setLevels(prevLevels =>
      prevLevels.map(level =>
        level.id === levelId
          ? { ...level, isUnlocked: true, unlockDate: new Date() }
          : level
      )
    );
  };

  const lockLevel = (levelId: string) => {
    setLevels(prevLevels =>
      prevLevels.map(level =>
        level.id === levelId
          ? { ...level, isLocked: true }
          : level
      )
    );
  };

  const markAsPlayed = (levelId: string) => {
    setLevels(prevLevels =>
      prevLevels.map(level =>
        level.id === levelId
          ? { ...level, hasBeenPlayed: true, isLocked: false }
          : level
      )
    );
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'tangle': return 'Tangles';
      case 'funthinker-basic': return 'Funthinker Basic';
      case 'funthinker-medium': return 'Funthinker Medium';
      case 'funthinker-hard': return 'Funthinker Hard';
      default: return category;
    }
  };

  const getStatusColor = (level: ManagedLevel) => {
    if (level.isLocked) return 'text-red-600 bg-red-50';
    if (!level.isUnlocked) return 'text-gray-600 bg-gray-50';
    if (level.daysUntilLock <= 3) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusIcon = (level: ManagedLevel) => {
    if (level.isLocked) return <Lock className="w-4 h-4" />;
    if (!level.isUnlocked) return <Clock className="w-4 h-4" />;
    if (level.hasBeenPlayed) return <CheckCircle className="w-4 h-4" />;
    if (level.daysUntilLock <= 3) return <AlertTriangle className="w-4 h-4" />;
    return <Unlock className="w-4 h-4" />;
  };

  const getStatusText = (level: ManagedLevel) => {
    if (level.isLocked) return 'Permanently Locked';
    if (!level.isUnlocked) return `Unlocks ${level.unlockDate.toLocaleDateString()}`;
    if (level.hasBeenPlayed) return 'Completed';
    if (level.daysUntilLock <= 3) return `${level.daysUntilLock} days until lock`;
    return 'Available';
  };

  const filteredLevels = selectedCategory === 'all' 
    ? levels 
    : levels.filter(level => level.category === selectedCategory);

  const stats = {
    total: levels.length,
    unlocked: levels.filter(l => l.isUnlocked && !l.isLocked).length,
    locked: levels.filter(l => l.isLocked).length,
    played: levels.filter(l => l.hasBeenPlayed).length,
    expiringSoon: levels.filter(l => l.daysUntilLock <= 3 && l.daysUntilLock > 0).length,
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Level Management System</h3>
        <div className="flex items-center gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="tangle">Tangles</option>
            <option value="funthinker-basic">Funthinker Basic</option>
            <option value="funthinker-medium">Funthinker Medium</option>
            <option value="funthinker-hard">Funthinker Hard</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-800">Total Levels</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.unlocked}</div>
          <div className="text-sm text-green-800">Available</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.played}</div>
          <div className="text-sm text-purple-800">Completed</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</div>
          <div className="text-sm text-orange-800">Expiring Soon</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.locked}</div>
          <div className="text-sm text-red-800">Locked</div>
        </div>
      </div>

      {/* Levels Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">Level</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Unlock Date</th>
              <th className="text-left py-3 px-4">Lock Date</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLevels.map((level) => (
              <tr key={level.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">Level {level.number}</td>
                <td className="py-3 px-4">{getCategoryDisplayName(level.category)}</td>
                <td className="py-3 px-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(level)}`}>
                    {getStatusIcon(level)}
                    {getStatusText(level)}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {level.unlockDate.toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {level.lockDate.toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    {!level.isUnlocked && (
                      <button
                        onClick={() => unlockLevel(level.id)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                      >
                        Unlock Now
                      </button>
                    )}
                    {level.isUnlocked && !level.isLocked && !level.hasBeenPlayed && (
                      <>
                        <button
                          onClick={() => markAsPlayed(level.id)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                        >
                          Mark Played
                        </button>
                        <button
                          onClick={() => lockLevel(level.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                        >
                          Lock Now
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLevels.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No levels found for the selected category.</p>
        </div>
      )}

      {/* System Rules */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h5 className="font-medium text-yellow-800 mb-2">Level Management Rules:</h5>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Levels unlock daily at 12:00 AM (midnight)</li>
          <li>• Users must complete the current level to unlock the next one</li>
          <li>• Levels automatically lock after 15 days if not played</li>
          <li>• Once locked, levels cannot be unlocked again (permanent lock)</li>
          <li>• Completed levels never lock and remain accessible</li>
          <li>• Admin can manually unlock/lock levels for testing purposes</li>
        </ul>
      </div>
    </div>
  );
};

export default LevelManagementSystem;