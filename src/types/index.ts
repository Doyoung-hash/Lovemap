export type EmotionTag =
  | 'stress'
  | 'worry'
  | 'joy'
  | 'anticipation'
  | 'sadness'
  | 'anger'
  | 'tired'
  | 'excited';

export const EMOTION_LABELS: Record<EmotionTag, string> = {
  stress: '스트레스',
  worry: '걱정',
  joy: '기쁨',
  anticipation: '기대',
  sadness: '슬픔',
  anger: '분노',
  tired: '피곤',
  excited: '설렘',
};

export const EMOTION_COLORS: Record<EmotionTag, string> = {
  stress: '#FF6B6B',
  worry: '#FFA94D',
  joy: '#FFD43B',
  anticipation: '#74C0FC',
  sadness: '#748FFC',
  anger: '#F06595',
  tired: '#A9A9A9',
  excited: '#63E6BE',
};

export const EMOTION_EMOJIS: Record<EmotionTag, string> = {
  stress: '😤',
  worry: '😟',
  joy: '😊',
  anticipation: '🤩',
  sadness: '😢',
  anger: '😠',
  tired: '😴',
  excited: '🥰',
};

export interface DailyIssue {
  id: string;
  userId: string;
  content: string;
  emotions: EmotionTag[];
  importance: number;
  createdAt: string;
  notifyPartner: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  relationshipStartDate?: string;
  partnerId?: string;
  partnerCode: string;
}

export type LoveMapCategory =
  | 'favorites'
  | 'dislikes'
  | 'stressors'
  | 'interests'
  | 'dreams'
  | 'fears'
  | 'importantPeople'
  | 'memories'
  | 'values';

export interface LoveMapEntry {
  id: string;
  category: LoveMapCategory;
  content: string;
  createdAt: string;
}

export interface LoveMapData {
  userId: string;
  entries: LoveMapEntry[];
}

export interface StressRecommendation {
  id: string;
  type: 'personal' | 'couple';
  duration: 'immediate' | 'short' | 'long';
  title: string;
  description: string;
  icon: string;
  tags: string[];
  isFavorite: boolean;
}

export interface IssueTopItem {
  keyword: string;
  count: number;
  lastEmotions: EmotionTag[];
  percentage: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  category: LoveMapCategory;
  targetUserId: string;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  topIssues: IssueTopItem[];
  emotionDistribution: Record<EmotionTag, number>;
  commonIssues: string[];
  insights: string[];
}
