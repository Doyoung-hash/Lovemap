/* ============================================================
   DATA — 앱 전체에서 사용하는 정적 데이터
   ============================================================ */

const EMOTIONS = [
  { key: 'stress',       label: '스트레스', emoji: '😤', color: '#FF6B6B' },
  { key: 'worry',        label: '걱정',     emoji: '😟', color: '#FFA94D' },
  { key: 'joy',          label: '기쁨',     emoji: '😊', color: '#FFD43B' },
  { key: 'anticipation', label: '기대',     emoji: '🤩', color: '#74C0FC' },
  { key: 'sadness',      label: '슬픔',     emoji: '😢', color: '#748FFC' },
  { key: 'anger',        label: '분노',     emoji: '😠', color: '#F06595' },
  { key: 'tired',        label: '피곤',     emoji: '😴', color: '#A9A9A9' },
  { key: 'excited',      label: '설렘',     emoji: '🥰', color: '#63E6BE' },
];

const EMOTION_MAP = Object.fromEntries(EMOTIONS.map(e => [e.key, e]));

const CATEGORIES = [
  {
    key: 'favorites',
    label: '좋아하는 것들',
    emoji: '❤️',
    color: '#FFE0EB',
    accent: '#FF6B9D',
    examples: ['파스타', '재즈 음악', '로맨틱 코미디', '한강 산책', '요리하기'],
  },
  {
    key: 'dislikes',
    label: '싫어하는 것들',
    emoji: '🙅',
    color: '#FFE3E3',
    accent: '#FF6B6B',
    examples: ['시끄러운 공간', '갑작스러운 변화', '늦은 일정'],
  },
  {
    key: 'stressors',
    label: '스트레스 요인',
    emoji: '⚡',
    color: '#FFF3BF',
    accent: '#E67700',
    examples: ['업무 마감', '건강 걱정', '재정 문제'],
  },
  {
    key: 'interests',
    label: '현재 관심사',
    emoji: '✨',
    color: '#E8F4FF',
    accent: '#4299E1',
    examples: ['독서', '러닝', '새로운 요리', '언어 공부'],
  },
  {
    key: 'dreams',
    label: '꿈과 목표',
    emoji: '🌟',
    color: '#FFF9DB',
    accent: '#F59F00',
    examples: ['해외여행', '내 집 마련', '건강한 몸'],
  },
  {
    key: 'fears',
    label: '두려움과 걱정',
    emoji: '🌙',
    color: '#EBE8FF',
    accent: '#7950F2',
    examples: ['미래 불안', '실패 두려움', '관계 걱정'],
  },
  {
    key: 'importantPeople',
    label: '중요한 사람들',
    emoji: '👨‍👩‍👧‍👦',
    color: '#DFFFF0',
    accent: '#2F9E44',
    examples: ['가족', '오랜 친구', '멘토'],
  },
  {
    key: 'memories',
    label: '소중한 추억',
    emoji: '📸',
    color: '#F3E8FF',
    accent: '#9C36B5',
    examples: ['첫 만남', '여행 추억', '특별한 순간'],
  },
  {
    key: 'values',
    label: '가치관과 신념',
    emoji: '💎',
    color: '#FFE8CC',
    accent: '#D9480F',
    examples: ['정직함', '가족 우선', '성장', '배려'],
  },
];

const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.key, c]));

const RECOMMENDATIONS = {
  personal: [
    {
      id: 'p1', duration: 'immediate', icon: '🌬️',
      title: '478 호흡법',
      desc: '4초 들이쉬고, 7초 참고, 8초 내쉬기. 3회 반복하면 긴장이 풀립니다.',
      tags: ['stress', 'anger', 'worry'],
    },
    {
      id: 'p2', duration: 'immediate', icon: '🧘',
      title: '5분 스트레칭',
      desc: '목, 어깨, 손목을 천천히 돌려주세요. 몸의 긴장을 풀어줍니다.',
      tags: ['tired', 'stress'],
    },
    {
      id: 'p3', duration: 'immediate', icon: '🍵',
      title: '따뜻한 차 한 잔',
      desc: '허브차나 카모마일 차를 천천히 음미하며 잠시 쉬어가세요.',
      tags: ['stress', 'worry', 'tired'],
    },
    {
      id: 'p4', duration: 'short', icon: '🚶',
      title: '20분 산책',
      desc: '밖에 나가 신선한 공기를 마시며 걷는 것만으로도 기분이 달라집니다.',
      tags: ['stress', 'worry', 'anger', 'tired'],
    },
    {
      id: 'p5', duration: 'short', icon: '🎵',
      title: '좋아하는 음악 감상',
      desc: '헤드폰을 끼고 좋아하는 노래 5~6곡을 온전히 들어보세요.',
      tags: ['sadness', 'stress', 'tired'],
    },
    {
      id: 'p6', duration: 'short', icon: '📝',
      title: '감정 일기 쓰기',
      desc: '지금 느끼는 감정을 솔직하게 써보세요. 생각이 정리됩니다.',
      tags: ['sadness', 'worry', 'anger'],
    },
    {
      id: 'p7', duration: 'long', icon: '🏃',
      title: '주 3회 운동 루틴',
      desc: '걷기, 수영, 요가 등 자신에게 맞는 운동을 꾸준히 해보세요.',
      tags: ['stress', 'tired', 'worry'],
    },
    {
      id: 'p8', duration: 'long', icon: '🎨',
      title: '새로운 취미 시작',
      desc: '그림 그리기, 요리, 악기 등 새로운 취미를 통해 활력을 찾아보세요.',
      tags: ['sadness', 'tired', 'stress'],
    },
  ],
  couple: [
    {
      id: 'c1', duration: 'immediate', icon: '🤗',
      title: '6초 포옹',
      desc: '연구에 따르면 6초 이상의 포옹은 옥시토신을 분비시켜 유대감을 높입니다.',
      tags: ['stress', 'sadness', 'tired'],
    },
    {
      id: 'c2', duration: 'short', icon: '🍳',
      title: '함께 요리하기',
      desc: '새로운 레시피를 같이 만들어보세요. 협력하며 즐거운 시간을 보낼 수 있어요.',
      tags: ['stress', 'tired'],
    },
    {
      id: 'c3', duration: 'short', icon: '💌',
      title: '감사 한마디 나누기',
      desc: '서로에게 감사한 점 3가지씩 말해보세요. 관계가 따뜻해집니다.',
      tags: ['sadness', 'worry'],
    },
    {
      id: 'c4', duration: 'short', icon: '🌿',
      title: '손 잡고 산책',
      desc: '스마트폰은 잠시 내려놓고 손 잡고 동네를 걸어보세요.',
      tags: ['stress', 'tired', 'sadness'],
    },
    {
      id: 'c5', duration: 'short', icon: '🎬',
      title: '영화 함께 보기',
      desc: '서로 좋아하는 장르를 번갈아 골라 함께 보는 루틴을 만들어보세요.',
      tags: ['tired', 'stress'],
    },
    {
      id: 'c6', duration: 'long', icon: '📅',
      title: '주간 체크인 루틴',
      desc: '매주 같은 시간에 서로의 한 주를 나누는 시간을 만들어보세요.',
      tags: ['stress', 'worry'],
    },
  ],
};

const CONVERSATION_STARTERS = [
  { emoji: '💭', text: '요즘 가장 기대되는 일이 뭐야?' },
  { emoji: '😔', text: '오늘 제일 힘들었던 순간은 언제였어?' },
  { emoji: '🤝', text: '지금 내가 어떻게 해주면 좋겠어?' },
  { emoji: '🙏', text: '최근에 나한테 감사했던 게 있어?' },
  { emoji: '🌈', text: '올해 같이 이루고 싶은 꿈이 있어?' },
  { emoji: '😟', text: '요즘 제일 걱정되는 게 뭐야?' },
  { emoji: '💡', text: '우리가 더 잘할 수 있는 게 있을까?' },
  { emoji: '🥰', text: '나의 어떤 점이 제일 좋아?' },
  { emoji: '⭐', text: '우리 관계에서 가장 소중한 추억이 뭐야?' },
  { emoji: '🔮', text: '5년 후 우리의 모습이 어땠으면 좋겠어?' },
];

const QUIZ_QUESTIONS = [
  { q: '내가 제일 좋아하는 음식은?', category: 'favorites' },
  { q: '내가 스트레스 받을 때 가장 먼저 하고 싶은 건?', category: 'stressors' },
  { q: '내가 가장 좋아하는 음악 장르나 가수는?', category: 'favorites' },
  { q: '요즘 내가 제일 관심 있는 것은?', category: 'interests' },
  { q: '내 버킷리스트 1위는?', category: 'dreams' },
  { q: '내가 가장 두려워하는 것은?', category: 'fears' },
  { q: '내가 싫어하는 상황이나 행동은?', category: 'dislikes' },
  { q: '나의 가장 소중한 추억은?', category: 'memories' },
  { q: '내가 가장 중요하게 생각하는 가치는?', category: 'values' },
  { q: '내가 가장 힘든 시간을 보낸 때는?', category: 'stressors' },
];

/* ─── 유틸 ─── */
function getEmotionInfo(key) {
  return EMOTION_MAP[key] || { key, label: key, emoji: '😐', color: '#999' };
}

function getCategoryInfo(key) {
  return CATEGORY_MAP[key] || { key, label: key, emoji: '📌', color: '#eee', accent: '#999' };
}

function getDurationLabel(d) {
  return { immediate: '즉각', short: '단기', long: '장기' }[d] || d;
}

function getDurationClass(d) {
  return { immediate: 'duration-immediate', short: 'duration-short', long: 'duration-long' }[d] || '';
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now - d) / 86400000);
  if (diff === 0) return '오늘';
  if (diff === 1) return '어제';
  if (diff < 7) return `${diff}일 전`;
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function formatTime(iso) {
  const d = new Date(iso);
  const h = d.getHours(), m = d.getMinutes().toString().padStart(2, '0');
  return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${m}`;
}

function getRelationshipDuration(startDate) {
  if (!startDate) return null;
  const days = Math.floor((Date.now() - new Date(startDate)) / 86400000);
  if (days < 30) return `${days}일째 💕`;
  if (days < 365) return `${Math.floor(days / 30)}개월째 💕`;
  const y = Math.floor(days / 365), mo = Math.floor((days % 365) / 30);
  return mo > 0 ? `${y}년 ${mo}개월째 💕` : `${y}년째 💕`;
}

function getLast7DaysIssues(issues) {
  const cutoff = Date.now() - 7 * 86400000;
  return issues.filter(i => new Date(i.createdAt).getTime() >= cutoff);
}

function extractTopKeywords(issues, limit = 10) {
  const counts = {};
  issues.forEach(issue => {
    const words = issue.content.replace(/[^\w가-힣\s]/g, '').split(/\s+/).filter(w => w.length > 1);
    words.forEach(w => {
      if (!counts[w]) counts[w] = { count: 0, emotions: [] };
      counts[w].count++;
      issue.emotions.forEach(e => {
        if (!counts[w].emotions.includes(e)) counts[w].emotions.push(e);
      });
    });
  });

  const total = Object.values(counts).reduce((s, v) => s + v.count, 0);
  return Object.entries(counts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit)
    .map(([keyword, data]) => ({
      keyword,
      count: data.count,
      emotions: data.emotions.slice(0, 2),
      pct: total ? Math.round(data.count / total * 100) : 0,
    }));
}

function scoreRecommendations(recs, issues) {
  const eCounts = {};
  issues.forEach(i => i.emotions.forEach(e => { eCounts[e] = (eCounts[e] || 0) + 1; }));
  const topEmotions = Object.entries(eCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
  return [...recs].sort((a, b) => {
    const sa = a.tags.filter(t => topEmotions.includes(t)).length;
    const sb = b.tags.filter(t => topEmotions.includes(t)).length;
    return sb - sa;
  });
}

/* ─── 샘플 데이터 (데모용) ─── */
const SAMPLE_PARTNER_ISSUES = [
  { id: 'pi1', content: '회사에서 프레젠테이션 준비하느라 너무 바빴어', emotions: ['stress', 'tired'], importance: 4, createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), notifyPartner: true },
  { id: 'pi2', content: '친구랑 오랜만에 만나서 기분 좋았어', emotions: ['joy', 'excited'], importance: 3, createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), notifyPartner: true },
  { id: 'pi3', content: '몸이 좀 안좋아서 걱정돼', emotions: ['worry', 'tired'], importance: 3, createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), notifyPartner: true },
  { id: 'pi4', content: '업무 미팅이 잘 끝나서 다행이야', emotions: ['joy', 'anticipation'], importance: 2, createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), notifyPartner: false },
  { id: 'pi5', content: '부모님 건강이 걱정돼서 전화했어', emotions: ['worry', 'sadness'], importance: 4, createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), notifyPartner: true },
];

const SAMPLE_PARTNER_LOVEMAP = [
  { id: 'pl1', category: 'favorites', content: '카페라떼', createdAt: new Date().toISOString() },
  { id: 'pl2', category: 'favorites', content: '재즈 음악', createdAt: new Date().toISOString() },
  { id: 'pl3', category: 'dreams', content: '유럽 여행', createdAt: new Date().toISOString() },
  { id: 'pl4', category: 'stressors', content: '업무 마감 압박', createdAt: new Date().toISOString() },
  { id: 'pl5', category: 'fears', content: '새로운 환경에 적응하는 것', createdAt: new Date().toISOString() },
];
