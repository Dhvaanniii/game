import React, { createContext, useContext, useState, useEffect } from 'react';

interface GameProgress {
  levelId: string;
  stars: number;
  attempts: number;
  completed: boolean;
  unlockedAt: Date;
}

interface GameContextType {
  progress: Record<string, GameProgress>;
  updateProgress: (levelId: string, stars: number, attempts: number) => void;
  isLevelUnlocked: (levelId: string, category: string) => boolean;
  getLevelProgress: (levelId: string) => GameProgress | null;
  unlockNextLevel: (currentLevelId: string, category: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<Record<string, GameProgress>>({});

  useEffect(() => {
    // Load progress from localStorage
    const storedProgress = localStorage.getItem('gameProgress');
    if (storedProgress) {
      const parsedProgress = JSON.parse(storedProgress);
      // Convert date strings back to Date objects
      Object.keys(parsedProgress).forEach(key => {
        parsedProgress[key].unlockedAt = new Date(parsedProgress[key].unlockedAt);
      });
      setProgress(parsedProgress);
    } else {
      // Initialize with first levels unlocked
      const initialProgress: Record<string, GameProgress> = {
        'tangle-1': {
          levelId: 'tangle-1',
          stars: 0,
          attempts: 0,
          completed: false,
          unlockedAt: new Date(),
        },
        'funthinker-basic-1': {
          levelId: 'funthinker-basic-1',
          stars: 0,
          attempts: 0,
          completed: false,
          unlockedAt: new Date(),
        },
        'funthinker-medium-1': {
          levelId: 'funthinker-medium-1',
          stars: 0,
          attempts: 0,
          completed: false,
          unlockedAt: new Date(),
        },
        'funthinker-hard-1': {
          levelId: 'funthinker-hard-1',
          stars: 0,
          attempts: 0,
          completed: false,
          unlockedAt: new Date(),
        },
      };
      setProgress(initialProgress);
    }
  }, []);

  useEffect(() => {
    // Save progress to localStorage whenever it changes
    localStorage.setItem('gameProgress', JSON.stringify(progress));
  }, [progress]);

  const updateProgress = (levelId: string, stars: number, attempts: number) => {
    setProgress(prev => ({
      ...prev,
      [levelId]: {
        levelId,
        stars,
        attempts,
        completed: true,
        unlockedAt: prev[levelId]?.unlockedAt || new Date(),
      },
    }));
  };

  const isLevelUnlocked = (levelId: string, category: string): boolean => {
    const levelProgress = progress[levelId];
    if (levelProgress) {
      // Check if 12 hours have passed since unlock
      const now = new Date();
      const timeDiff = now.getTime() - levelProgress.unlockedAt.getTime();
      return timeDiff >= 0; // Always accessible once unlocked
    }

    // Check if previous level is completed or if this is level 1
    const levelNumber = parseInt(levelId.split('-').pop() || '1');
    if (levelNumber === 1) return true;

    const prevLevelId = `${category}-${levelNumber - 1}`;
    const prevProgress = progress[prevLevelId];
    
    // Level can be accessed if previous level was attempted (not necessarily completed)
    return prevProgress && prevProgress.attempts > 0;
  };

  const getLevelProgress = (levelId: string): GameProgress | null => {
    return progress[levelId] || null;
  };

  const unlockNextLevel = (currentLevelId: string, category: string) => {
    const currentLevelNum = parseInt(currentLevelId.split('-').pop() || '1');
    const nextLevelId = `${category}-${currentLevelNum + 1}`;
    
    // Check if next level exists and isn't already unlocked
    const maxLevels = category === 'tangle' ? 200 : 20; // Assuming 20 levels per funthinker category
    if (currentLevelNum < maxLevels && !progress[nextLevelId]) {
      const unlockTime = new Date();
      unlockTime.setHours(unlockTime.getHours() + 12); // Unlock after 12 hours
      
      setProgress(prev => ({
        ...prev,
        [nextLevelId]: {
          levelId: nextLevelId,
          stars: 0,
          attempts: 0,
          completed: false,
          unlockedAt: unlockTime,
        },
      }));
    }
  };

  return (
    <GameContext.Provider value={{ progress, updateProgress, isLevelUnlocked, getLevelProgress, unlockNextLevel }}>
      {children}
    </GameContext.Provider>
  );
};