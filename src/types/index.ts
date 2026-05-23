export interface UserProfile {
  id: string;
  name: string;
  totalCoins: number;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  section: 'head' | 'body' | 'feet';
  isDefault: boolean;
}

export interface SubGoal {
  id: string;
  text: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  deadline?: Date;
  repeats: boolean;
  subGoals: SubGoal[];
  status: 'active' | 'backlog' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskTemplate {
  id: string;
  name: string;
  type: 'fixed' | 'time-based';
  coins: number;
  version: string;
  createdAt: Date;
}

export interface DailyTask {
  id: string;
  description: string;
  coins: number;
  categoryId?: string;
  createdAt: Date;
}

export interface DailyLogEntry {
  id: string;
  date: Date;
  tasks: DailyTask[];
  totalCoins: number;
  hasPenalty: boolean;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  emoji: string;
  cost: number;
  createdAt: Date;
}

export interface RedemptionHistory {
  id: string;
  rewardId: string;
  rewardName: string;
  rewardEmoji: string;
  coinsCost: number;
  redeemedAt: Date;
}

export interface RadarDataPoint {
  category: string;
  score: number;
  fullMark: number;
}

export interface AppState {
  userProfile: UserProfile;
  categories: Category[];
  goals: Goal[];
  logEntries: DailyLogEntry[];
  templates: TaskTemplate[];
  rewards: Reward[];
  redemptionHistory: RedemptionHistory[];
}
