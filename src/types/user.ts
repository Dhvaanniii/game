export interface User {
  id: string;
  username: string;
  password: string;
  realname: string;
  email: string;
  language: string;
  school: string;
  standard: string;
  board: string;
  country: string;
  state: string;
  city: string;
  coins: number;
  userType: 'admin' | 'user';
  createdAt: Date;
  lastLogin?: Date;
}

export interface GameAttempt {
  id: string;
  userId: string;
  levelId: string;
  category: 'tangle' | 'funthinker-basic' | 'funthinker-medium' | 'funthinker-hard';
  attemptNumber: number;
  points: number;
  completed: boolean;
  timeUsed: number;
  timestamp: Date;
}

export interface Level {
  id: string;
  levelNumber: number;
  category: 'tangle' | 'funthinker-basic' | 'funthinker-medium' | 'funthinker-hard';
  outlineUrl: string;
  unlockDate: Date;
  lockDate: Date;
  isLocked: boolean;
  uploadDate: Date;
}

export interface WeeklyReport {
  userId: string;
  weekStart: Date;
  weekEnd: Date;
  attempts: GameAttempt[];
  totalPoints: number;
  pdfPath: string;
}