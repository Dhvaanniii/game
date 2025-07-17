export interface GameBlock {
  id: string;
  name: string;
  type: 'small-triangle' | 'medium-triangle' | 'large-triangle' | 'square' | 'parallelogram';
  svgPath: string;
  defaultSize: number;
  canMirror: boolean;
}

export interface Level {
  id: string;
  number: number;
  category: 'tangle' | 'funthinker-basic' | 'funthinker-medium' | 'funthinker-hard';
  outlineUrl: string;
  unlockDate: Date;
  lockDate: Date;
  isLocked: boolean;
  uploadDate: Date;
}

export interface GameAttempt {
  id: string;
  userId: string;
  levelId: string;
  attemptNumber: number;
  points: number;
  completed: boolean;
  timeUsed: number;
  timestamp: Date;
}

export interface WeeklyReport {
  userId: string;
  weekStart: Date;
  weekEnd: Date;
  attempts: GameAttempt[];
  totalPoints: number;
  pdfPath: string;
}