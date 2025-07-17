// Game logic utilities for puzzle validation and scoring

export interface GameAttempt {
  attemptNumber: number;
  timeUsed: number;
  completed: boolean;
  points: number;
  timestamp: Date;
}

export interface LevelProgress {
  levelId: string;
  category: 'tangle' | 'funthinker-basic' | 'funthinker-medium' | 'funthinker-hard';
  attempts: GameAttempt[];
  bestScore: number;
  totalPoints: number;
  isCompleted: boolean;
  unlockedAt: Date;
  lockedAt?: Date;
}

export const calculatePoints = (attemptNumber: number): number => {
  switch (attemptNumber) {
    case 1: return 300;
    case 2: return 200;
    case 3: return 100;
    default: return 0;
  }
};

export const isLevelLocked = (level: LevelProgress): boolean => {
  if (!level.lockedAt) return false;
  return new Date() > level.lockedAt && !level.isCompleted;
};

export const shouldLockLevel = (level: LevelProgress): boolean => {
  if (level.isCompleted) return false;
  
  const daysSinceUnlock = Math.floor(
    (new Date().getTime() - level.unlockedAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return daysSinceUnlock >= 15;
};

export const getNextUnlockTime = (): Date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // Midnight
  return tomorrow;
};

export const generateWeeklyReport = (
  userId: string,
  attempts: GameAttempt[],
  weekStart: Date,
  weekEnd: Date
) => {
  const weeklyAttempts = attempts.filter(
    attempt => attempt.timestamp >= weekStart && attempt.timestamp <= weekEnd
  );

  const totalPoints = weeklyAttempts.reduce((sum, attempt) => sum + attempt.points, 0);
  const completedLevels = weeklyAttempts.filter(attempt => attempt.completed).length;
  const averageScore = weeklyAttempts.length > 0 ? totalPoints / weeklyAttempts.length : 0;

  return {
    userId,
    weekStart,
    weekEnd,
    attempts: weeklyAttempts,
    totalPoints,
    completedLevels,
    averageScore,
    totalAttempts: weeklyAttempts.length
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z]{2}@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  return passwordRegex.test(password);
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getOrdinalSuffix = (num: number): string => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
};