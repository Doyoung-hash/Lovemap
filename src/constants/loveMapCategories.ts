import { LoveMapCategory } from '../types';

export interface CategoryInfo {
  key: LoveMapCategory;
  label: string;
  icon: string;
  description: string;
  color: string;
  examples: string[];
}

export const LOVE_MAP_CATEGORIES: CategoryInfo[] = [
  {
    key: 'favorites',
    label: '좋아하는 것들',
    icon: '❤️',
    description: '음식, 음악, 영화, 장소, 활동 등 내가 좋아하는 모든 것',
    color: '#FF6B9D',
    examples: ['파스타', '재즈 음악', '로맨틱 코미디', '한강 산책', '요리'],
  },
  {
    key: 'dislikes',
    label: '싫어하는 것들',
    icon: '🙅',
    description: '불편하거나 피하고 싶은 것들',
    color: '#FF6B6B',
    examples: ['시끄러운 장소', '갑작스러운 변화', '늦은 일정'],
  },
  {
    key: 'stressors',
    label: '현재 스트레스 요인',
    icon: '⚡',
    description: '지금 나를 힘들게 하는 것들',
    color: '#FFA94D',
    examples: ['업무 마감', '건강 걱정', '재정 문제', '관계 갈등'],
  },
  {
    key: 'interests',
    label: '현재 관심사',
    icon: '✨',
    description: '요즘 몰두하고 있거나 관심 있는 것들',
    color: '#74C0FC',
    examples: ['독서 클럽', '러닝', '새로운 요리 레시피', '언어 공부'],
  },
  {
    key: 'dreams',
    label: '꿈과 목표',
    icon: '🌟',
    description: '단기/장기 목표와 이루고 싶은 꿈',
    color: '#FFD43B',
    examples: ['해외여행', '내 집 마련', '건강한 몸', '창업', '자격증 취득'],
  },
  {
    key: 'fears',
    label: '두려움과 걱정',
    icon: '🌙',
    description: '마음속에 있는 두려움이나 걱정거리',
    color: '#748FFC',
    examples: ['미래에 대한 불안', '실패 두려움', '건강 걱정', '관계 걱정'],
  },
  {
    key: 'importantPeople',
    label: '중요한 사람들',
    icon: '👨‍👩‍👧‍👦',
    description: '내 삶에서 중요한 가족, 친구, 동료',
    color: '#63E6BE',
    examples: ['가족', '오랜 친구', '멘토', '동료'],
  },
  {
    key: 'memories',
    label: '중요한 추억',
    icon: '📸',
    description: '소중하게 간직하는 기억들',
    color: '#C77DFF',
    examples: ['첫 만남', '여행 추억', '가족과의 특별한 순간'],
  },
  {
    key: 'values',
    label: '가치관과 신념',
    icon: '💎',
    description: '나의 삶을 이끄는 가치관과 신념',
    color: '#FF9A3C',
    examples: ['정직함', '가족 우선', '성장', '배려', '자유'],
  },
];
