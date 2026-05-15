import { EmotionTag, DailyIssue, StressRecommendation } from '../types';

const PERSONAL_IMMEDIATE: StressRecommendation[] = [
  {
    id: 'p-imm-1',
    type: 'personal',
    duration: 'immediate',
    title: '478 호흡법',
    description: '4초 들이쉬고, 7초 참고, 8초 내쉬기. 3회 반복하면 긴장이 풀립니다.',
    icon: '🌬️',
    tags: ['stress', 'anger', 'worry'],
    isFavorite: false,
  },
  {
    id: 'p-imm-2',
    type: 'personal',
    duration: 'immediate',
    title: '5분 스트레칭',
    description: '목, 어깨, 손목을 천천히 돌려주세요. 몸의 긴장을 풀어줍니다.',
    icon: '🧘',
    tags: ['tired', 'stress'],
    isFavorite: false,
  },
  {
    id: 'p-imm-3',
    type: 'personal',
    duration: 'immediate',
    title: '차 한 잔 마시기',
    description: '따뜻한 허브차나 카모마일 차를 천천히 음미해보세요.',
    icon: '🍵',
    tags: ['stress', 'worry', 'tired'],
    isFavorite: false,
  },
];

const PERSONAL_SHORT: StressRecommendation[] = [
  {
    id: 'p-sht-1',
    type: 'personal',
    duration: 'short',
    title: '20분 산책',
    description: '밖에 나가 신선한 공기를 마시며 걸어보세요. 머리가 맑아집니다.',
    icon: '🚶',
    tags: ['stress', 'worry', 'anger', 'tired'],
    isFavorite: false,
  },
  {
    id: 'p-sht-2',
    type: 'personal',
    duration: 'short',
    title: '좋아하는 음악 감상',
    description: '헤드폰을 끼고 좋아하는 노래 5~6곡을 온전히 들어보세요.',
    icon: '🎵',
    tags: ['sadness', 'stress', 'tired'],
    isFavorite: false,
  },
  {
    id: 'p-sht-3',
    type: 'personal',
    duration: 'short',
    title: '마음챙김 명상',
    description: '조용한 공간에서 눈을 감고 호흡에만 집중해보세요. 앱: Calm, 명상해요',
    icon: '🧠',
    tags: ['stress', 'worry', 'anger'],
    isFavorite: false,
  },
  {
    id: 'p-sht-4',
    type: 'personal',
    duration: 'short',
    title: '일기 쓰기',
    description: '지금 느끼는 감정을 솔직하게 써보세요. 생각이 정리됩니다.',
    icon: '📝',
    tags: ['sadness', 'worry', 'anger'],
    isFavorite: false,
  },
];

const PERSONAL_LONG: StressRecommendation[] = [
  {
    id: 'p-lng-1',
    type: 'personal',
    duration: 'long',
    title: '주 3회 운동 루틴',
    description: '걷기, 수영, 요가 등 자신에게 맞는 운동을 꾸준히 해보세요.',
    icon: '🏃',
    tags: ['stress', 'tired', 'worry'],
    isFavorite: false,
  },
  {
    id: 'p-lng-2',
    type: 'personal',
    duration: 'long',
    title: '취미 활동 시작',
    description: '그림 그리기, 요리, 악기 등 새로운 취미를 시작해보세요.',
    icon: '🎨',
    tags: ['sadness', 'tired', 'stress'],
    isFavorite: false,
  },
];

const COUPLE_ACTIVITIES: StressRecommendation[] = [
  {
    id: 'c-1',
    type: 'couple',
    duration: 'short',
    title: '저녁 함께 요리하기',
    description: '새로운 레시피를 같이 만들어보세요. 대화하며 즐거운 시간을 보낼 수 있어요.',
    icon: '🍳',
    tags: ['stress', 'tired'],
    isFavorite: false,
  },
  {
    id: 'c-2',
    type: 'couple',
    duration: 'immediate',
    title: '포옹 6초 유지하기',
    description: '연구에 따르면 6초 이상의 포옹은 옥시토신을 분비시킵니다.',
    icon: '🤗',
    tags: ['stress', 'sadness', 'tired'],
    isFavorite: false,
  },
  {
    id: 'c-3',
    type: 'couple',
    duration: 'short',
    title: '감사 일기 나눠 읽기',
    description: '서로에게 감사한 점 3가지를 말해보세요.',
    icon: '💌',
    tags: ['sadness', 'worry'],
    isFavorite: false,
  },
  {
    id: 'c-4',
    type: 'couple',
    duration: 'long',
    title: '주간 체크인 루틴',
    description: '매주 같은 시간에 서로의 한 주를 나누는 시간을 만들어보세요.',
    icon: '📅',
    tags: ['stress', 'worry'],
    isFavorite: false,
  },
  {
    id: 'c-5',
    type: 'couple',
    duration: 'short',
    title: '함께 산책하기',
    description: '스마트폰은 잠시 내려놓고 손 잡고 동네를 걸어보세요.',
    icon: '🌿',
    tags: ['stress', 'tired', 'sadness'],
    isFavorite: false,
  },
  {
    id: 'c-6',
    type: 'couple',
    duration: 'short',
    title: '좋아하는 영화 보기',
    description: '서로 좋아하는 장르의 영화를 번갈아 골라 함께 보세요.',
    icon: '🎬',
    tags: ['tired', 'stress'],
    isFavorite: false,
  },
];

const CONVERSATION_STARTERS: string[] = [
  '요즘 가장 기대되는 일이 뭐야?',
  '오늘 제일 힘들었던 순간은 언제였어?',
  '지금 내가 어떻게 해주면 좋겠어?',
  '최근에 나한테 감사했던 게 있어?',
  '올해 같이 이루고 싶은 꿈이 있어?',
  '요즘 제일 걱정되는 게 뭐야?',
  '우리가 더 잘할 수 있는 게 있을까?',
  '나에 대해 새롭게 알게 된 게 있어?',
];

export function getRecommendations(
  recentIssues: DailyIssue[],
  limit = 6
): StressRecommendation[] {
  const emotionCounts: Record<string, number> = {};
  recentIssues.forEach((issue) => {
    issue.emotions.forEach((e) => {
      emotionCounts[e] = (emotionCounts[e] || 0) + 1;
    });
  });

  const topEmotions = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([e]) => e);

  const allPersonal = [...PERSONAL_IMMEDIATE, ...PERSONAL_SHORT, ...PERSONAL_LONG];
  const scored = allPersonal.map((rec) => ({
    rec,
    score: rec.tags.filter((t) => topEmotions.includes(t)).length,
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.rec);
}

export function getCoupleRecommendations(
  recentIssues: DailyIssue[],
  limit = 4
): StressRecommendation[] {
  const emotionCounts: Record<string, number> = {};
  recentIssues.forEach((issue) => {
    issue.emotions.forEach((e) => {
      emotionCounts[e] = (emotionCounts[e] || 0) + 1;
    });
  });

  const topEmotions = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([e]) => e);

  const scored = COUPLE_ACTIVITIES.map((rec) => ({
    rec,
    score: rec.tags.filter((t) => topEmotions.includes(t)).length,
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.rec);
}

export function getRandomConversationStarter(): string {
  return CONVERSATION_STARTERS[Math.floor(Math.random() * CONVERSATION_STARTERS.length)];
}

export function extractTopIssues(issues: DailyIssue[], limit = 10) {
  const keywordCounts: Record<string, { count: number; emotions: EmotionTag[] }> = {};

  issues.forEach((issue) => {
    const words = issue.content
      .replace(/[^\wㄱ-힣\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 1);

    words.forEach((word) => {
      if (!keywordCounts[word]) {
        keywordCounts[word] = { count: 0, emotions: [] };
      }
      keywordCounts[word].count += 1;
      issue.emotions.forEach((e) => {
        if (!keywordCounts[word].emotions.includes(e)) {
          keywordCounts[word].emotions.push(e);
        }
      });
    });
  });

  const totalCount = Object.values(keywordCounts).reduce((s, v) => s + v.count, 0);

  return Object.entries(keywordCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit)
    .map(([keyword, data]) => ({
      keyword,
      count: data.count,
      lastEmotions: data.emotions.slice(0, 2) as EmotionTag[],
      percentage: totalCount > 0 ? Math.round((data.count / totalCount) * 100) : 0,
    }));
}
