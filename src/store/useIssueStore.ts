import { create } from 'zustand';
import { DailyIssue, EmotionTag, IssueTopItem } from '../types';
import { generateId } from '../utils/dateHelpers';
import { extractTopIssues } from '../utils/recommendations';

interface IssueState {
  myIssues: DailyIssue[];
  partnerIssues: DailyIssue[];
  isLoading: boolean;

  addIssue: (
    content: string,
    emotions: EmotionTag[],
    importance: number,
    notifyPartner: boolean
  ) => void;
  updateIssue: (id: string, updates: Partial<DailyIssue>) => void;
  deleteIssue: (id: string) => void;
  getLast7DaysIssues: () => DailyIssue[];
  getMyTopIssues: (limit?: number) => IssueTopItem[];
  getPartnerTopIssues: (limit?: number) => IssueTopItem[];
  getCommonIssues: () => string[];
  loadPartnerIssues: () => void;
}

const MOCK_PARTNER_ISSUES: DailyIssue[] = [
  {
    id: 'p-001',
    userId: 'partner-001',
    content: '회사에서 프레젠테이션 준비하느라 너무 바빴어',
    emotions: ['stress', 'tired'],
    importance: 4,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notifyPartner: true,
  },
  {
    id: 'p-002',
    userId: 'partner-001',
    content: '친구랑 오랜만에 만나서 기분 좋았어',
    emotions: ['joy', 'excited'],
    importance: 3,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notifyPartner: true,
  },
  {
    id: 'p-003',
    userId: 'partner-001',
    content: '몸이 좀 안좋아서 걱정돼',
    emotions: ['worry', 'tired'],
    importance: 3,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    notifyPartner: true,
  },
  {
    id: 'p-004',
    userId: 'partner-001',
    content: '오늘 업무 미팅이 잘 끝나서 다행이야',
    emotions: ['joy', 'anticipation'],
    importance: 3,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    notifyPartner: false,
  },
  {
    id: 'p-005',
    userId: 'partner-001',
    content: '부모님 건강이 좀 걱정돼서 전화했어',
    emotions: ['worry', 'sadness'],
    importance: 4,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notifyPartner: true,
  },
];

const MOCK_MY_ISSUES: DailyIssue[] = [
  {
    id: 'm-001',
    userId: 'user-001',
    content: '업무 마감이 다가와서 스트레스 받고 있어',
    emotions: ['stress', 'worry'],
    importance: 5,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notifyPartner: true,
  },
  {
    id: 'm-002',
    userId: 'user-001',
    content: '운동을 시작했는데 생각보다 재밌어',
    emotions: ['joy', 'excited'],
    importance: 3,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notifyPartner: false,
  },
  {
    id: 'm-003',
    userId: 'user-001',
    content: '팀 회의에서 내 의견이 무시된 것 같아 속상해',
    emotions: ['sadness', 'anger'],
    importance: 4,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    notifyPartner: false,
  },
];

export const useIssueStore = create<IssueState>((set, get) => ({
  myIssues: MOCK_MY_ISSUES,
  partnerIssues: MOCK_PARTNER_ISSUES,
  isLoading: false,

  addIssue: (content, emotions, importance, notifyPartner) => {
    const newIssue: DailyIssue = {
      id: generateId(),
      userId: 'user-001',
      content,
      emotions,
      importance,
      createdAt: new Date().toISOString(),
      notifyPartner,
    };
    set((state) => ({ myIssues: [newIssue, ...state.myIssues] }));
  },

  updateIssue: (id, updates) => {
    set((state) => ({
      myIssues: state.myIssues.map((issue) =>
        issue.id === id ? { ...issue, ...updates } : issue
      ),
    }));
  },

  deleteIssue: (id) => {
    set((state) => ({
      myIssues: state.myIssues.filter((issue) => issue.id !== id),
    }));
  },

  getLast7DaysIssues: () => {
    const { myIssues } = get();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return myIssues.filter((issue) => new Date(issue.createdAt) >= sevenDaysAgo);
  },

  getMyTopIssues: (limit = 10) => {
    const { myIssues } = get();
    return extractTopIssues(myIssues, limit);
  },

  getPartnerTopIssues: (limit = 10) => {
    const { partnerIssues } = get();
    return extractTopIssues(partnerIssues, limit);
  },

  getCommonIssues: () => {
    const myTop = get().getMyTopIssues(20).map((i) => i.keyword);
    const partnerTop = get().getPartnerTopIssues(20).map((i) => i.keyword);
    return myTop.filter((k) => partnerTop.includes(k)).slice(0, 5);
  },

  loadPartnerIssues: () => {
    set({ partnerIssues: MOCK_PARTNER_ISSUES });
  },
}));
