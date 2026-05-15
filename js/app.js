/* ============================================================
   APP.JS — LoveMap 메인 애플리케이션 (Supabase 연동)
   ============================================================ */

/* ── UI 상태 ── */
const ui = {
  loveMapTab: 'my',
  loveMapCategory: null,
  loveMapView: 'grid',
  guideTab: 'personal',
  quizIndex: 0,
  quizAnswers: {},
  quizDone: false,
  selectedEmotions: [],
  starRating: 3,
  notifyPartner: true,
  starterIndex: 0,
  isLoading: false,
};

/* ============================================================
   ROUTER
   ============================================================ */
const Router = {
  screen: 'splash',
  history: [],

  navigate(screen, opts = {}) {
    if (opts.reset) this.history = [];
    else this.history.push(this.screen);
    this.screen = screen;
    this.render();
  },

  back() {
    if (this.history.length > 0) {
      this.screen = this.history.pop();
      this.render();
    }
  },

  render() {
    const app = document.getElementById('app');
    app.innerHTML = SCREENS[this.screen] ? SCREENS[this.screen]() : renderNotFound();
    onScreenMounted(this.screen);
  },
};

const SCREENS = {
  splash:         renderSplash,
  login:          renderLogin,
  signup:         renderSignup,
  partnerConnect: renderPartnerConnect,
  profileSetup:   renderProfileSetup,
  home:           renderHome,
  loveMap:        renderLoveMap,
  dashboard:      renderDashboard,
  guide:          renderGuide,
  settings:       renderSettings,
};

/* ── 로딩 오버레이 ── */
function showLoading(msg = '잠시만요...') {
  let el = document.getElementById('loading-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'loading-overlay';
    el.style.cssText = `
      position:fixed;inset:0;background:rgba(255,240,243,.85);
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      z-index:9000;backdrop-filter:blur(4px);font-family:'Noto Sans KR',sans-serif;
    `;
    document.body.appendChild(el);
  }
  el.innerHTML = `<div style="font-size:36px;margin-bottom:12px;animation:pulse 1s infinite">💕</div>
    <div style="font-size:14px;color:#7A5C6E;font-weight:500">${msg}</div>`;
  el.style.display = 'flex';
}

function hideLoading() {
  const el = document.getElementById('loading-overlay');
  if (el) el.style.display = 'none';
}

/* ── Bottom Nav ── */
function renderBottomNav(active) {
  const tabs = [
    { key: 'home',      icon: '🏠', label: '홈' },
    { key: 'loveMap',   icon: '🧠', label: '뇌지도' },
    { key: 'dashboard', icon: '📊', label: 'TOP 10' },
    { key: 'guide',     icon: '💆', label: '해소법' },
    { key: 'settings',  icon: '⚙️', label: '설정' },
  ];
  return `
    <nav class="bottom-nav">
      ${tabs.map(t => `
        <button class="nav-item ${t.key === active ? 'active' : ''}" data-nav="${t.key}">
          <div class="nav-icon">${t.icon}</div>
          <div class="nav-dot"></div>
          <div class="nav-label">${t.label}</div>
        </button>
      `).join('')}
    </nav>`;
}

/* ============================================================
   SCREENS
   ============================================================ */

/* ── Splash ── */
function renderSplash() {
  return `
    <div class="screen splash-screen">
      <div class="splash-logo">💕</div>
      <div class="splash-title">사랑의 지도</div>
      <div class="splash-subtitle">Love Map by Gottman</div>
      <div class="splash-dots"><span></span><span></span><span></span></div>
    </div>`;
}

/* ── Login ── */
function renderLogin() {
  return `
    <div class="screen">
      <div class="gradient-header">
        <span class="emoji">💕</span>
        <h1>사랑의 지도</h1>
        <p>서로의 내면 세계를 함께 탐험해요</p>
      </div>
      <div class="onboarding-body">
        <div class="form-group">
          <label class="form-label">이메일</label>
          <input class="form-input" type="email" id="login-email" placeholder="이메일을 입력하세요">
        </div>
        <div class="form-group">
          <label class="form-label">비밀번호</label>
          <input class="form-input" type="password" id="login-pw" placeholder="비밀번호를 입력하세요">
        </div>
        <div id="auth-error" style="color:var(--error);font-size:13px;text-align:center;min-height:18px;margin-bottom:8px"></div>
        <button class="btn btn-primary" id="btn-login">시작하기 →</button>
        <div class="auth-divider"><span>또는</span></div>
        <div class="auth-footer">처음이세요? <button data-goto="signup">회원가입</button></div>
      </div>
    </div>`;
}

/* ── Signup ── */
function renderSignup() {
  return `
    <div class="screen">
      <div class="gradient-header">
        <span class="emoji">✨</span>
        <h1>회원가입</h1>
        <p>새로운 여정을 시작해요</p>
      </div>
      <div class="onboarding-body">
        <div class="form-group">
          <label class="form-label">이름</label>
          <input class="form-input" type="text" id="signup-name" placeholder="이름을 입력하세요">
        </div>
        <div class="form-group">
          <label class="form-label">이메일</label>
          <input class="form-input" type="email" id="signup-email" placeholder="이메일을 입력하세요">
        </div>
        <div class="form-group">
          <label class="form-label">비밀번호</label>
          <input class="form-input" type="password" id="signup-pw" placeholder="6자 이상 입력하세요">
        </div>
        <div id="auth-error" style="color:var(--error);font-size:13px;text-align:center;min-height:18px;margin-bottom:8px"></div>
        <button class="btn btn-primary" id="btn-signup">가입하기 →</button>
        <div class="auth-footer">이미 계정이 있으신가요? <button data-goto="login">로그인</button></div>
      </div>
    </div>`;
}

/* ── Partner Connect ── */
function renderPartnerConnect() {
  const user = Store.get('currentUser');
  const code = user?.partner_code || '------';
  return `
    <div class="screen">
      <div class="gradient-header">
        <span class="emoji">🔗</span>
        <h1>파트너 연결</h1>
        <p>초대 코드로 서로를 연결해요</p>
      </div>
      <div class="onboarding-body">
        <p style="text-align:center;font-size:14px;color:var(--text2);margin-bottom:16px;line-height:1.7">
          아래 코드를 파트너에게 공유하거나,<br>파트너의 코드를 입력해 연결하세요
        </p>

        <div class="code-box" style="margin-bottom:24px">
          <div class="code-label">나의 초대 코드</div>
          <div class="code-value">${code}</div>
          <button class="btn btn-ghost btn-sm mt-8" id="btn-copy-code" style="color:var(--primary)">
            📋 복사하기
          </button>
        </div>

        <div class="form-group">
          <label class="form-label">파트너 코드 입력</label>
          <input class="form-input" type="text" id="partner-code-input"
            placeholder="6자리 코드 입력" maxlength="6"
            style="text-align:center;letter-spacing:4px;font-size:20px;font-weight:700;text-transform:uppercase">
        </div>
        <div id="partner-msg" style="text-align:center;font-size:13px;min-height:18px;margin-bottom:8px"></div>
        <button class="btn btn-primary" id="btn-connect-partner">연결하기 💕</button>
        <div style="margin-top:12px">
          <button class="btn btn-ghost" id="btn-skip-partner" style="width:100%;color:var(--text3)">나중에 연결하기</button>
        </div>
      </div>
    </div>`;
}

/* ── Profile Setup ── */
function renderProfileSetup() {
  const user = Store.get('currentUser');
  const today = new Date().toISOString().split('T')[0];
  return `
    <div class="screen">
      <div class="gradient-header">
        <span class="emoji">👤</span>
        <h1>프로필 설정</h1>
        <p>관계 정보를 입력해주세요</p>
      </div>
      <div class="onboarding-body">
        <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:24px">
          <div class="profile-avatar-large">${user?.name?.charAt(0) || '?'}</div>
          <div style="font-size:18px;font-weight:700;color:var(--text)">${user?.name || ''}</div>
        </div>
        <div class="form-group">
          <label class="form-label">이름 수정</label>
          <input class="form-input" type="text" id="profile-name" value="${user?.name || ''}" placeholder="이름을 입력하세요">
        </div>
        <div class="form-group">
          <label class="form-label">관계 시작일 💕</label>
          <input class="form-input" type="date" id="profile-date" max="${today}">
        </div>
        <button class="btn btn-primary mt-20" id="btn-save-profile">시작하기 🚀</button>
      </div>
    </div>`;
}

/* ── Home ── */
function renderHome() {
  const user = Store.get('currentUser');
  const partner = Store.get('partnerUser');
  const myIssues = Store.get('myIssues') || [];
  const partnerIssues = Store.get('partnerIssues') || [];
  const last7 = getLast7DaysIssues(myIssues);
  const duration = user?.relationship_start_date ? getRelationshipDuration(user.relationship_start_date) : null;
  const today = new Date().toDateString();
  const todayIssue = myIssues.find(i => new Date(i.created_at).toDateString() === today);

  return `
    <div class="screen">
      <div class="home-header">
        <div class="home-header-row">
          <div>
            <div class="home-greeting">안녕하세요 👋</div>
            <div class="home-name">${user?.name || '사용자'}님</div>
          </div>
          ${duration ? `<div class="home-duration">${duration}</div>` : ''}
        </div>
        ${partner ? `<div class="home-partner-chip">💑 ${partner.name}과 함께</div>` : ''}
      </div>

      <div class="screen-body">
        <div class="section-header" style="margin-top:0">
          <div class="section-title">오늘의 이슈</div>
          ${todayIssue ? '<span style="font-size:11px;color:var(--success);font-weight:600">✓ 오늘 입력 완료</span>' : ''}
        </div>

        <div class="card">
          <textarea class="form-input" id="issue-input" maxlength="100"
            placeholder="오늘 가장 마음에 걸리는 것을 한 줄로 적어보세요..."
            rows="3">${todayIssue ? todayIssue.content : ''}</textarea>
          <div class="char-count"><span id="char-count">0</span>/100</div>

          <div style="margin:12px 0 8px">
            <div class="form-label">감정 태그 (복수 선택 가능)</div>
            <div class="emotion-grid">
              ${EMOTIONS.map(e => `
                <button class="emotion-tag ${ui.selectedEmotions.includes(e.key) ? 'selected' : ''}"
                  data-emotion="${e.key}"
                  style="${ui.selectedEmotions.includes(e.key) ? `background:${e.color};color:white;border-color:transparent` : ''}">
                  ${e.emoji} ${e.label}
                </button>`).join('')}
            </div>
          </div>

          <div style="margin:12px 0 8px">
            <div class="form-label">중요도</div>
            <div class="star-rating" id="star-rating">
              ${[1,2,3,4,5].map(n => `
                <span class="star ${n <= ui.starRating ? 'active' : ''}" data-star="${n}">⭐</span>`).join('')}
            </div>
          </div>

          <div class="toggle-row" style="margin:12px 0">
            <div>
              <div class="toggle-label">파트너에게 알림</div>
              <div class="toggle-sublabel">파트너가 알 수 있도록 공유해요</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="notify-toggle" ${ui.notifyPartner ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>

          <button class="btn btn-primary" id="btn-submit-issue">
            ${todayIssue ? '수정하기' : '저장하기'} 💕
          </button>
        </div>

        <div class="section-header">
          <div class="section-title">💬 대화 스타터</div>
          <button class="section-link" id="btn-shuffle-starter">새로고침</button>
        </div>
        ${renderStarterCard()}

        <div class="section-header">
          <div class="section-title">지난 7일간 이슈</div>
          <span style="font-size:12px;color:var(--text3)">${last7.length}개</span>
        </div>
        ${renderTimeline(last7)}

        ${partner ? `
          <div class="section-header">
            <div class="section-title">${partner.name}의 최근 이슈</div>
          </div>
          ${renderPartnerPreview(partner, partnerIssues)}
        ` : `
          <div class="card" style="text-align:center;padding:24px;border-style:dashed">
            <div style="font-size:32px;margin-bottom:8px">🔗</div>
            <div style="font-size:14px;color:var(--text2);margin-bottom:12px">파트너를 연결하면<br>서로의 이슈를 볼 수 있어요</div>
            <button class="btn btn-primary btn-sm" style="width:140px;margin:0 auto" data-goto="partnerConnect">파트너 연결하기</button>
          </div>`}
      </div>

      ${renderBottomNav('home')}
    </div>`;
}

function renderStarterCard() {
  const s = CONVERSATION_STARTERS[ui.starterIndex % CONVERSATION_STARTERS.length];
  return `
    <div class="starter-card" id="starter-card">
      <div class="starter-emoji">${s.emoji}</div>
      <div class="starter-text">"${s.text}"</div>
      <div class="starter-hint">탭하면 새 질문이 나와요</div>
    </div>`;
}

function renderTimeline(issues) {
  if (issues.length === 0) {
    return `
      <div class="empty-timeline">
        <div class="empty-emoji">📭</div>
        <p>아직 기록이 없어요.<br>오늘의 이슈를 입력해보세요!</p>
      </div>`;
  }
  return issues.map(issue => {
    const d = new Date(issue.created_at);
    const days = ['일','월','화','수','목','금','토'];
    return `
      <div class="timeline-item">
        <div class="timeline-date">
          <div class="timeline-date-num">${d.getDate()}</div>
          <div class="timeline-date-day">${days[d.getDay()]}</div>
        </div>
        <div class="timeline-line"></div>
        <div class="timeline-card">
          <div class="timeline-content">${escHtml(issue.content)}</div>
          <div class="timeline-emotions">
            ${issue.emotions.map(ek => {
              const em = getEmotionInfo(ek);
              return `<span class="mini-tag" style="background:${em.color}">${em.emoji} ${em.label}</span>`;
            }).join('')}
          </div>
          <div class="timeline-meta">
            <div class="timeline-importance">${'⭐'.repeat(issue.importance)}</div>
            <div class="timeline-time">${formatTime(issue.created_at)}</div>
          </div>
        </div>
      </div>`;
  }).join('');
}

function renderPartnerPreview(partner, issues) {
  const latest = issues[0];
  return `
    <div class="partner-preview">
      <div class="partner-preview-header">
        <div class="partner-avatar">${partner.name.charAt(0)}</div>
        <div>
          <div class="partner-name">${partner.name}</div>
          <div class="partner-updated">${latest ? formatDate(latest.created_at) + '에 업데이트' : '아직 기록 없음'}</div>
        </div>
      </div>
      ${latest ? `
        <div class="partner-issue-preview">"${escHtml(latest.content)}"</div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:8px">
          ${latest.emotions.map(ek => {
            const em = getEmotionInfo(ek);
            return `<span class="mini-tag" style="background:${em.color}">${em.emoji} ${em.label}</span>`;
          }).join('')}
        </div>` :
        '<div style="font-size:13px;color:var(--text3)">파트너가 아직 이슈를 입력하지 않았어요</div>'}
    </div>`;
}

/* ── Love Map ── */
function renderLoveMap() {
  const partner = Store.get('partnerUser');
  const myMap = Store.get('myLoveMap') || [];
  const partnerMap = Store.get('partnerLoveMap') || [];

  if (ui.loveMapView === 'detail' && ui.loveMapCategory) {
    return renderCategoryDetail(ui.loveMapTab, myMap, partnerMap, partner);
  }

  return `
    <div class="screen">
      <div style="padding:52px 16px 16px;background:linear-gradient(135deg,#FF6B9D,#C77DFF);color:white;flex-shrink:0">
        <h2 style="font-size:22px;font-weight:800">🧠 뇌 지도</h2>
        <p style="font-size:13px;opacity:.85;margin-top:4px">서로의 내면 세계를 기록해요</p>
      </div>
      <div class="screen-body">
        <div class="tab-bar">
          <button class="tab-item ${ui.loveMapTab==='my'?'active':''}" data-lmtab="my">내 지도</button>
          <button class="tab-item ${ui.loveMapTab==='partner'?'active':''}" data-lmtab="partner">${partner?.name||'파트너'} 지도</button>
          <button class="tab-item ${ui.loveMapTab==='quiz'?'active':''}" data-lmtab="quiz">퀴즈</button>
        </div>
        ${ui.loveMapTab === 'quiz' ? renderQuiz(partner, partnerMap) : renderCategoryGrid(ui.loveMapTab, myMap, partnerMap, partner)}
      </div>
      ${renderBottomNav('loveMap')}
    </div>`;
}

function renderCategoryGrid(tab, myMap, partnerMap, partner) {
  const map = tab === 'my' ? myMap : partnerMap;
  if (tab === 'partner' && !partner) {
    return `
      <div class="no-content">
        <div class="no-content-emoji">🔗</div>
        <p>파트너를 연결하면<br>파트너의 뇌 지도를 볼 수 있어요</p>
        <button class="btn btn-primary btn-sm mt-16" style="width:160px;margin:16px auto 0" data-goto="partnerConnect">파트너 연결하기</button>
      </div>`;
  }
  return `
    <div class="category-grid">
      ${CATEGORIES.map(cat => {
        const count = map.filter(e => e.category === cat.key).length;
        return `
          <button class="category-card" data-category="${cat.key}"
            style="background:${cat.color};border-color:${cat.accent}33">
            ${count > 0 ? `<div class="category-count">${count}</div>` : ''}
            <div class="category-emoji">${cat.emoji}</div>
            <div class="category-name">${cat.label}</div>
          </button>`;
      }).join('')}
    </div>`;
}

function renderCategoryDetail(tab, myMap, partnerMap, partner) {
  const cat = getCategoryInfo(ui.loveMapCategory);
  const entries = (tab === 'my' ? myMap : partnerMap).filter(e => e.category === ui.loveMapCategory);
  const isReadOnly = tab === 'partner';

  return `
    <div class="screen">
      <div style="padding:52px 16px 16px;background:${cat.color};flex-shrink:0">
        <div class="category-detail-header">
          <button class="category-detail-back" id="btn-cat-back">←</button>
          <div>
            <div style="font-size:11px;color:var(--text3);font-weight:600;text-transform:uppercase">
              ${isReadOnly ? (partner?.name||'파트너') + '의 지도' : '내 지도'}
            </div>
            <div class="category-detail-title">${cat.emoji} ${cat.label}</div>
          </div>
        </div>
      </div>
      <div class="screen-body" style="padding-bottom:calc(var(--nav-height) + 16px)">
        ${entries.length === 0 ? `
          <div class="no-content">
            <div class="no-content-emoji">${cat.emoji}</div>
            <p>${isReadOnly ? `${partner?.name||'파트너'}가 아직 입력하지 않았어요` : '아직 기록이 없어요.<br>첫 번째 항목을 추가해보세요!'}</p>
          </div>` : ''}

        ${entries.map(e => `
          <div class="entry-item">
            <div class="entry-text">${escHtml(e.content)}</div>
            ${!isReadOnly ? `<button class="entry-delete" data-delete-entry="${e.id}">✕</button>` : ''}
          </div>`).join('')}

        ${!isReadOnly ? `
          <div class="add-entry-row">
            <input class="add-entry-input" id="new-entry-input"
              placeholder="${cat.examples ? '예: ' + cat.examples[0] : '내용을 입력하세요'}" maxlength="60">
            <button class="btn btn-primary btn-sm" id="btn-add-entry" style="width:60px;flex-shrink:0">추가</button>
          </div>
          ${cat.examples ? `
            <div style="margin-top:12px">
              <div style="font-size:12px;color:var(--text3);margin-bottom:8px;font-weight:600">예시</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px">
                ${cat.examples.map(ex => `
                  <button class="badge badge-primary" style="cursor:pointer" data-example="${escHtml(ex)}">${ex}</button>
                `).join('')}
              </div>
            </div>` : ''}
        ` : ''}
      </div>
      ${renderBottomNav('loveMap')}
    </div>`;
}

function renderQuiz(partner, partnerMap) {
  if (!partner) {
    return `
      <div class="no-content">
        <div class="no-content-emoji">🔗</div>
        <p>파트너를 먼저 연결해야<br>퀴즈를 즐길 수 있어요!</p>
        <button class="btn btn-primary btn-sm mt-16" style="width:160px;margin:16px auto 0" data-goto="partnerConnect">파트너 연결하기</button>
      </div>`;
  }
  if (ui.quizDone) {
    const total = QUIZ_QUESTIONS.length;
    const correct = Object.values(ui.quizAnswers).filter(a => a.isCorrect).length;
    const pct = Math.round(correct / total * 100);
    let msg = '더 알아가는 중이에요! 💪';
    if (pct >= 80) msg = '완벽해요! 최고의 커플 🏆';
    else if (pct >= 60) msg = '꽤 잘 알고 있네요! 💕';
    else if (pct >= 40) msg = '함께 더 성장해봐요 🌱';
    return `
      <div class="quiz-result">
        <div style="font-size:48px;margin-bottom:12px">🎉</div>
        <div class="quiz-score">${pct}%</div>
        <div class="quiz-result-msg">${msg}</div>
        <div class="quiz-result-sub">${total}문제 중 ${correct}개 맞췄어요.<br>파트너의 뇌지도를 채우면 점수가 올라가요!</div>
        <button class="btn btn-primary mt-20" id="btn-retry-quiz">다시 도전하기</button>
      </div>`;
  }
  const q = QUIZ_QUESTIONS[ui.quizIndex];
  const cat = getCategoryInfo(q.category);
  const entries = partnerMap.filter(e => e.category === q.category);
  const hint = entries.length > 0 ? `파트너의 ${cat.label}에서 힌트를 얻어보세요 😉` : `파트너의 ${cat.label}에 아직 기록이 없어요`;
  return `
    <div class="quiz-card">
      <div class="quiz-progress-bar">
        <div class="quiz-progress-fill" style="width:${(ui.quizIndex/QUIZ_QUESTIONS.length)*100}%"></div>
      </div>
      <div class="quiz-emoji">${cat.emoji}</div>
      <div class="quiz-category-badge">${cat.label} · ${ui.quizIndex+1}/${QUIZ_QUESTIONS.length}</div>
      <div class="quiz-question">${partner.name}의 "${q.q}"</div>
      <input class="quiz-input" id="quiz-answer" placeholder="답을 입력하세요...">
      <div class="quiz-hint">${hint}</div>
      <button class="btn btn-primary" id="btn-quiz-next">
        ${ui.quizIndex < QUIZ_QUESTIONS.length-1 ? '다음 →' : '결과 보기 🎉'}
      </button>
    </div>`;
}

/* ── Dashboard ── */
function renderDashboard() {
  const partner = Store.get('partnerUser');
  const myIssues = Store.get('myIssues') || [];
  const partnerIssues = Store.get('partnerIssues') || [];
  const myTop = extractTopKeywords(myIssues, 10);
  const partnerTop = extractTopKeywords(partnerIssues, 10);
  const common = myTop.map(i=>i.keyword).filter(k => partnerTop.map(i=>i.keyword).includes(k)).slice(0,5);
  const maxMy = myTop[0]?.count || 1;
  const maxPt = partnerTop[0]?.count || 1;

  return `
    <div class="screen">
      <div style="padding:52px 16px 16px;background:linear-gradient(135deg,#FF9A3C,#FF6B9D);color:white;flex-shrink:0">
        <h2 style="font-size:22px;font-weight:800">📊 이슈 TOP 10</h2>
        <p style="font-size:13px;opacity:.85;margin-top:4px">최근 이슈를 빈도순으로 분석했어요</p>
      </div>
      <div class="screen-body">
        ${common.length > 0 ? `
          <div class="card" style="background:linear-gradient(135deg,rgba(255,107,157,.06),rgba(199,125,255,.06));border-color:rgba(255,107,157,.25)">
            <div class="card-title">💑 공통 이슈</div>
            <div class="common-issues">${common.map(k=>`<span class="common-chip">${k}</span>`).join('')}</div>
          </div>` : ''}

        <div class="section-header">
          <div class="section-title">나의 TOP 10</div>
          <span style="font-size:12px;color:var(--text3)">${myIssues.length}개 기록</span>
        </div>
        ${myTop.length > 0 ?
          `<div class="rank-list">${myTop.map((item,i)=>renderRankItem(item,i,maxMy)).join('')}</div>` :
          `<div class="no-content"><div class="no-content-emoji">📝</div><p>아직 이슈 기록이 없어요</p></div>`}

        ${partner ? `
          <div class="section-header" style="margin-top:20px">
            <div class="section-title">${partner.name}의 TOP 10</div>
            <span style="font-size:12px;color:var(--text3)">${partnerIssues.length}개 기록</span>
          </div>
          ${partnerTop.length > 0 ?
            `<div class="rank-list">${partnerTop.map((item,i)=>renderRankItem(item,i,maxPt,true)).join('')}</div>` :
            `<div class="no-content"><div class="no-content-emoji">💤</div><p>파트너가 아직 이슈를 입력하지 않았어요</p></div>`}
        ` : `
          <div class="card" style="text-align:center;padding:24px;border-style:dashed;margin-top:16px">
            <div style="font-size:32px;margin-bottom:8px">🔗</div>
            <div style="font-size:14px;color:var(--text2)">파트너를 연결하면<br>비교 분석을 볼 수 있어요</div>
          </div>`}
      </div>
      ${renderBottomNav('dashboard')}
    </div>`;
}

function renderRankItem(item, index, maxCount, isPartner=false) {
  const rankClass = index===0?'top1':index===1?'top2':index===2?'top3':'rest';
  const barW = Math.round(item.count/maxCount*100);
  return `
    <div class="rank-item">
      <div class="rank-num ${rankClass}">${index+1}</div>
      <div class="rank-content">
        <div class="rank-keyword">${escHtml(item.keyword)}</div>
        <div class="rank-bar-wrap">
          <div class="rank-bar" style="width:${barW}%;background:${isPartner?'linear-gradient(90deg,#C77DFF,#FF6B9D)':'linear-gradient(90deg,#FF6B9D,#C77DFF)'}"></div>
        </div>
      </div>
      <div class="rank-count">${item.count}회</div>
    </div>`;
}

/* ── Guide ── */
function renderGuide() {
  const myIssues = Store.get('myIssues') || [];
  const favorites = Store.get('favorites') || [];
  const recs = scoreRecommendations(RECOMMENDATIONS[ui.guideTab], getLast7DaysIssues(myIssues));

  return `
    <div class="screen">
      <div style="padding:52px 16px 16px;background:linear-gradient(135deg,#63E6BE,#4299E1);color:white;flex-shrink:0">
        <h2 style="font-size:22px;font-weight:800">💆 스트레스 해소</h2>
        <p style="font-size:13px;opacity:.85;margin-top:4px">나의 이슈에 맞춤 추천이에요</p>
      </div>
      <div class="screen-body">
        <div class="tab-bar">
          <button class="tab-item ${ui.guideTab==='personal'?'active':''}" data-guidetab="personal">개인 해소법</button>
          <button class="tab-item ${ui.guideTab==='couple'?'active':''}" data-guidetab="couple">커플 해소법</button>
        </div>
        ${recs.map(rec=>`
          <div class="guide-card">
            <div class="guide-icon">${rec.icon}</div>
            <div class="guide-content">
              <span class="guide-duration ${getDurationClass(rec.duration)}">${getDurationLabel(rec.duration)}</span>
              <div class="guide-title">${rec.title}</div>
              <div class="guide-desc">${rec.desc}</div>
            </div>
            <button class="guide-fav" data-fav="${rec.id}">${favorites.includes(rec.id)?'❤️':'🤍'}</button>
          </div>`).join('')}
        ${favorites.length > 0 ? `
          <div class="section-header" style="margin-top:8px">
            <div class="section-title">❤️ 즐겨찾기</div>
          </div>
          ${[...RECOMMENDATIONS.personal,...RECOMMENDATIONS.couple]
            .filter(r=>favorites.includes(r.id))
            .map(rec=>`
              <div class="guide-card" style="border-color:rgba(255,107,157,.4)">
                <div class="guide-icon">${rec.icon}</div>
                <div class="guide-content">
                  <span class="guide-duration ${getDurationClass(rec.duration)}">${getDurationLabel(rec.duration)}</span>
                  <div class="guide-title">${rec.title}</div>
                  <div class="guide-desc">${rec.desc}</div>
                </div>
                <button class="guide-fav" data-fav="${rec.id}">❤️</button>
              </div>`).join('')}` : ''}
      </div>
      ${renderBottomNav('guide')}
    </div>`;
}

/* ── Settings ── */
function renderSettings() {
  const user = Store.get('currentUser');
  const partner = Store.get('partnerUser');
  const settings = Store.get('settings') || {};

  return `
    <div class="screen">
      <div style="padding:52px 16px 16px;background:linear-gradient(135deg,#748FFC,#C77DFF);color:white;flex-shrink:0">
        <h2 style="font-size:22px;font-weight:800">⚙️ 설정</h2>
      </div>
      <div class="screen-body">
        <div class="profile-section">
          <div class="profile-avatar-large">${user?.name?.charAt(0)||'?'}</div>
          <div class="profile-display-name">${user?.name||'사용자'}</div>
          <div class="profile-email">${user?.email||''}</div>
          ${user?.relationship_start_date ? `
            <div style="margin-top:8px">
              <span class="badge badge-primary">${getRelationshipDuration(user.relationship_start_date)}</span>
            </div>` : ''}
        </div>

        <!-- 초대 코드 -->
        ${user?.partner_code ? `
          <div class="settings-section">
            <div class="settings-section-title">나의 초대 코드</div>
            <div class="code-box">
              <div class="code-label">파트너에게 공유하세요</div>
              <div class="code-value">${user.partner_code}</div>
              <button class="btn btn-ghost btn-sm mt-8" id="btn-copy-code" style="color:var(--primary)">📋 복사하기</button>
            </div>
          </div>` : ''}

        <!-- 파트너 -->
        <div class="settings-section">
          <div class="settings-section-title">파트너</div>
          ${partner ? `
            <div class="settings-item">
              <div class="settings-item-icon" style="background:linear-gradient(135deg,#C77DFF22,#FF6B9D22)">💑</div>
              <div class="settings-item-content">
                <div class="settings-item-title">${partner.name}</div>
                <div class="settings-item-subtitle">연결됨 ✓</div>
              </div>
              <button class="btn btn-ghost btn-sm" id="btn-disconnect" style="color:var(--error);font-size:12px">연결 해제</button>
            </div>` : `
            <div class="settings-item" id="btn-goto-connect">
              <div class="settings-item-icon" style="background:#FFE0EB">🔗</div>
              <div class="settings-item-content">
                <div class="settings-item-title">파트너 연결하기</div>
                <div class="settings-item-subtitle">초대 코드로 파트너와 연결해요</div>
              </div>
              <div class="settings-item-arrow">›</div>
            </div>`}
        </div>

        <!-- 알림 -->
        <div class="settings-section">
          <div class="settings-section-title">알림</div>
          <div class="card">
            <div class="toggle-row">
              <div>
                <div class="toggle-label">파트너 알림 공유</div>
                <div class="toggle-sublabel">이슈 저장 시 파트너에게 공유</div>
              </div>
              <label class="toggle">
                <input type="checkbox" id="set-notify" ${settings.notifyPartner!==false?'checked':''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- 데이터 -->
        <div class="settings-section">
          <div class="settings-section-title">데이터</div>
          <div class="settings-item" id="btn-export">
            <div class="settings-item-icon" style="background:#DFFFF0">📤</div>
            <div class="settings-item-content">
              <div class="settings-item-title">데이터 내보내기</div>
              <div class="settings-item-subtitle">JSON 파일로 저장</div>
            </div>
            <div class="settings-item-arrow">›</div>
          </div>
        </div>

        <button class="btn btn-secondary mt-8" id="btn-logout" style="border-color:#FF6B6B;color:#FF6B6B">
          로그아웃
        </button>
      </div>
      ${renderBottomNav('settings')}
    </div>`;
}

function renderNotFound() {
  return `<div class="screen" style="align-items:center;justify-content:center">
    <div style="text-align:center;color:var(--text3)">
      <div style="font-size:48px;margin-bottom:12px">🤔</div><p>페이지를 찾을 수 없어요</p>
    </div></div>`;
}

/* ============================================================
   EVENT HANDLERS
   ============================================================ */
function onScreenMounted(screen) {
  if (screen === 'home') {
    const el = document.getElementById('issue-input');
    const cc = document.getElementById('char-count');
    if (el && cc) {
      cc.textContent = el.value.length;
      el.addEventListener('input', () => { cc.textContent = el.value.length; });
    }
  }
}

document.addEventListener('click', function(e) {
  const t = e.target.closest('[data-nav],[data-goto],[data-emotion],[data-star],[data-lmtab],[data-guidetab],[data-category],[data-delete-entry],[data-example],[data-fav],#btn-login,#btn-signup,#btn-connect-partner,#btn-skip-partner,#btn-copy-code,#btn-save-profile,#btn-submit-issue,#starter-card,#btn-shuffle-starter,#btn-cat-back,#btn-add-entry,#btn-quiz-next,#btn-retry-quiz,#btn-logout,#btn-disconnect,#btn-goto-connect,#btn-export');
  if (!t) return;

  if (t.dataset.nav) {
    ui.loveMapView='grid'; ui.loveMapCategory=null;
    Router.navigate(t.dataset.nav); return;
  }
  if (t.dataset.goto) { Router.navigate(t.dataset.goto); return; }

  if (t.dataset.emotion) {
    const ek = t.dataset.emotion;
    const idx = ui.selectedEmotions.indexOf(ek);
    if (idx>=0) ui.selectedEmotions.splice(idx,1); else ui.selectedEmotions.push(ek);
    const em = getEmotionInfo(ek);
    if (ui.selectedEmotions.includes(ek)) {
      t.classList.add('selected'); t.style.background=em.color; t.style.color='white'; t.style.borderColor='transparent';
    } else {
      t.classList.remove('selected'); t.style.background=''; t.style.color=''; t.style.borderColor='';
    }
    return;
  }

  if (t.dataset.star) {
    ui.starRating = parseInt(t.dataset.star);
    document.querySelectorAll('.star').forEach(s => s.classList.toggle('active', parseInt(s.dataset.star)<=ui.starRating));
    return;
  }

  if (t.id==='btn-login')           { handleLogin(); return; }
  if (t.id==='btn-signup')          { handleSignup(); return; }
  if (t.id==='btn-connect-partner') { handlePartnerConnect(); return; }
  if (t.id==='btn-skip-partner')    { Router.navigate('profileSetup'); return; }
  if (t.id==='btn-copy-code')       { copyPartnerCode(); return; }
  if (t.id==='btn-save-profile')    { handleSaveProfile(); return; }
  if (t.id==='btn-submit-issue')    { handleSubmitIssue(); return; }

  if (t.id==='starter-card'||t.id==='btn-shuffle-starter'||t.closest('#starter-card')) {
    ui.starterIndex=(ui.starterIndex+1)%CONVERSATION_STARTERS.length;
    const card=document.getElementById('starter-card');
    if(card){const s=CONVERSATION_STARTERS[ui.starterIndex];card.innerHTML=`<div class="starter-emoji">${s.emoji}</div><div class="starter-text">"${s.text}"</div><div class="starter-hint">탭하면 새 질문이 나와요</div>`;}
    return;
  }

  if (t.dataset.lmtab) {
    ui.loveMapTab=t.dataset.lmtab;
    if(t.dataset.lmtab==='quiz'){ui.quizIndex=0;ui.quizAnswers={};ui.quizDone=false;}
    ui.loveMapView='grid'; ui.loveMapCategory=null;
    Router.navigate('loveMap'); return;
  }

  if (t.dataset.category) { ui.loveMapCategory=t.dataset.category; ui.loveMapView='detail'; Router.navigate('loveMap'); return; }
  if (t.id==='btn-cat-back') { ui.loveMapView='grid'; ui.loveMapCategory=null; Router.navigate('loveMap'); return; }
  if (t.id==='btn-add-entry') { handleAddEntry(); return; }
  if (t.dataset.example) { const inp=document.getElementById('new-entry-input'); if(inp){inp.value=t.dataset.example;inp.focus();} return; }
  if (t.dataset.deleteEntry) { handleDeleteEntry(t.dataset.deleteEntry); return; }

  if (t.id==='btn-quiz-next') { handleQuizNext(); return; }
  if (t.id==='btn-retry-quiz') { ui.quizIndex=0;ui.quizAnswers={};ui.quizDone=false;Router.navigate('loveMap'); return; }

  if (t.dataset.guidetab) { ui.guideTab=t.dataset.guidetab; Router.navigate('guide'); return; }
  if (t.dataset.fav) { handleFavorite(t.dataset.fav); return; }

  if (t.id==='btn-disconnect') { handleDisconnect(); return; }
  if (t.id==='btn-goto-connect') { Router.navigate('partnerConnect'); return; }
  if (t.id==='btn-export') { exportData(); return; }
  if (t.id==='btn-logout') { handleLogout(); return; }
});

document.addEventListener('keydown', function(e) {
  if (e.key!=='Enter') return;
  if (e.target.id==='new-entry-input') handleAddEntry();
  if (e.target.id==='quiz-answer') document.getElementById('btn-quiz-next')?.click();
  if (e.target.id==='partner-code-input') handlePartnerConnect();
  if (e.target.id==='login-email'||e.target.id==='login-pw') handleLogin();
  if (e.target.id==='signup-name'||e.target.id==='signup-email'||e.target.id==='signup-pw') handleSignup();
});

document.addEventListener('change', function(e) {
  if (e.target.id==='notify-toggle') ui.notifyPartner=e.target.checked;
  if (e.target.id==='set-notify') {
    const s=Store.get('settings')||{};
    Store.set({settings:{...s,notifyPartner:e.target.checked}});
  }
});

/* ============================================================
   ACTION HANDLERS (Supabase 연동)
   ============================================================ */

async function handleLogin() {
  const email = document.getElementById('login-email')?.value?.trim();
  const pw    = document.getElementById('login-pw')?.value;
  if (!email||!pw) return showToast('이메일과 비밀번호를 입력해주세요');
  showLoading('로그인 중...');
  try {
    const user = await Auth.signIn(email, pw);
    await loadUserSession(user.id);
    Router.navigate('home', { reset:true });
  } catch(err) {
    hideLoading();
    const msg = err.message?.includes('Invalid') ? '이메일 또는 비밀번호가 틀렸어요' : err.message;
    showAuthError(msg);
  }
}

async function handleSignup() {
  const name  = document.getElementById('signup-name')?.value?.trim();
  const email = document.getElementById('signup-email')?.value?.trim();
  const pw    = document.getElementById('signup-pw')?.value;
  if (!name||!email||!pw) return showToast('모든 항목을 입력해주세요');
  if (pw.length<6) return showToast('비밀번호는 6자 이상이어야 해요');
  showLoading('계정 만드는 중...');
  try {
    const user = await Auth.signUp(email, pw, name);
    const code = genCode();
    const profile = await DB.upsertProfile({ id:user.id, name, email, partner_code:code });
    Store.set({ isLoggedIn:true, currentUser:profile, myIssues:[], myLoveMap:[], partnerIssues:[], partnerLoveMap:[], favorites:[] });
    hideLoading();
    Router.navigate('partnerConnect');
  } catch(err) {
    hideLoading();
    const msg = err.message?.includes('already registered') ? '이미 사용 중인 이메일이에요' : err.message;
    showAuthError(msg);
  }
}

async function handlePartnerConnect() {
  const code = document.getElementById('partner-code-input')?.value?.trim().toUpperCase();
  if (!code||code.length<6) return showToast('6자리 코드를 입력해주세요');
  showLoading('파트너 연결 중...');
  try {
    const { data, error } = await sb.rpc('connect_partner', { input_code: code });
    hideLoading();
    if (error || !data?.success) {
      const msgEl = document.getElementById('partner-msg');
      if (msgEl) { msgEl.textContent = data?.message || '연결에 실패했어요'; msgEl.style.color='var(--error)'; }
      return;
    }
    // 파트너 프로필 로드
    const user = Store.get('currentUser');
    const partnerProfile = await DB.getProfile(data.partner_id);
    const partnerIssues  = await DB.getPartnerIssues(data.partner_id);
    const partnerMap     = await DB.getLoveMap(data.partner_id);
    Store.set({
      currentUser: { ...user, partner_id: data.partner_id },
      partnerUser: partnerProfile,
      partnerIssues,
      partnerLoveMap: partnerMap,
    });
    showToast(`${data.partner_name}님과 연결됐어요! 💕`);
    setTimeout(() => Router.navigate('profileSetup'), 800);
  } catch(err) {
    hideLoading();
    showToast('연결 중 오류가 발생했어요');
  }
}

async function handleSaveProfile() {
  const name = document.getElementById('profile-name')?.value?.trim();
  const date = document.getElementById('profile-date')?.value;
  const user = Store.get('currentUser');
  if (!user) return;
  showLoading('저장 중...');
  try {
    const updated = await DB.upsertProfile({
      ...user,
      name: name || user.name,
      relationship_start_date: date || null,
    });
    Store.set({ currentUser: updated });
    hideLoading();
    Router.navigate('home', { reset:true });
  } catch {
    hideLoading();
    showToast('저장에 실패했어요');
  }
}

async function handleSubmitIssue() {
  const content = document.getElementById('issue-input')?.value?.trim();
  if (!content) return showToast('이슈 내용을 입력해주세요');
  if (ui.selectedEmotions.length===0) return showToast('감정 태그를 하나 이상 선택해주세요');
  const user = Store.get('currentUser');
  const notify = document.getElementById('notify-toggle')?.checked ?? ui.notifyPartner;
  showLoading('저장 중...');
  try {
    const newIssue = await DB.addIssue({
      user_id: user.id,
      content,
      emotions: [...ui.selectedEmotions],
      importance: ui.starRating,
      notify_partner: notify,
    });
    const myIssues = Store.get('myIssues') || [];
    const today = new Date().toDateString();
    const filtered = myIssues.filter(i => new Date(i.created_at).toDateString() !== today);
    Store.set({ myIssues: [newIssue, ...filtered] });
    ui.selectedEmotions=[];
    ui.starRating=3;
    hideLoading();
    showToast('저장됐어요! 💕');
    setTimeout(() => Router.navigate('home'), 600);
  } catch {
    hideLoading();
    showToast('저장에 실패했어요');
  }
}

async function handleAddEntry() {
  const input = document.getElementById('new-entry-input');
  const text = input?.value?.trim();
  if (!text) return showToast('내용을 입력해주세요');
  const user = Store.get('currentUser');
  try {
    const entry = await DB.addLoveMapEntry({ user_id:user.id, category:ui.loveMapCategory, content:text });
    const myMap = Store.get('myLoveMap') || [];
    Store.set({ myLoveMap: [...myMap, entry] });
    showToast('추가됐어요!');
    Router.navigate('loveMap');
  } catch {
    showToast('추가에 실패했어요');
  }
}

async function handleDeleteEntry(id) {
  try {
    await DB.deleteLoveMapEntry(id);
    const myMap = Store.get('myLoveMap') || [];
    Store.set({ myLoveMap: myMap.filter(e => e.id !== id) });
    Router.navigate('loveMap');
  } catch {
    showToast('삭제에 실패했어요');
  }
}

async function handleFavorite(recId) {
  const user = Store.get('currentUser');
  try {
    const isNowFav = await DB.toggleFavorite(user.id, recId);
    const favs = Store.get('favorites') || [];
    if (isNowFav) Store.set({ favorites: [...favs, recId] });
    else Store.set({ favorites: favs.filter(f => f !== recId) });
    Router.navigate('guide');
  } catch {
    showToast('즐겨찾기 변경에 실패했어요');
  }
}

async function handleDisconnect() {
  if (!confirm('파트너 연결을 해제할까요?')) return;
  const user = Store.get('currentUser');
  showLoading('연결 해제 중...');
  try {
    await DB.upsertProfile({ ...user, partner_id: null });
    Store.set({ currentUser:{...user,partner_id:null}, partnerUser:null, partnerIssues:[], partnerLoveMap:[] });
    hideLoading();
    showToast('파트너 연결이 해제됐어요');
    Router.navigate('settings');
  } catch {
    hideLoading();
    showToast('연결 해제에 실패했어요');
  }
}

async function handleLogout() {
  if (!confirm('로그아웃 하시겠어요?')) return;
  await Auth.signOut();
  Store.reset();
  Router.navigate('login', { reset:true });
}

function handleQuizNext() {
  const answer = document.getElementById('quiz-answer')?.value?.trim();
  if (!answer) return showToast('답을 입력해주세요');
  const q = QUIZ_QUESTIONS[ui.quizIndex];
  const partnerMap = Store.get('partnerLoveMap') || [];
  const entries = partnerMap.filter(e => e.category===q.category);
  const isCorrect = entries.some(e => e.content.includes(answer)||answer.includes(e.content.slice(0,3)));
  ui.quizAnswers[ui.quizIndex] = { answer, isCorrect };
  if (ui.quizIndex < QUIZ_QUESTIONS.length-1) ui.quizIndex++;
  else ui.quizDone = true;
  Router.navigate('loveMap');
}

/* ============================================================
   DATA LOADING
   ============================================================ */
async function loadUserSession(userId) {
  const [profile, myIssues, myMap, favs] = await Promise.all([
    DB.getProfile(userId),
    DB.getMyIssues(userId),
    DB.getLoveMap(userId),
    DB.getFavorites(userId),
  ]);

  let partnerUser=null, partnerIssues=[], partnerMap=[];
  if (profile?.partner_id) {
    [partnerUser, partnerIssues, partnerMap] = await Promise.all([
      DB.getProfile(profile.partner_id),
      DB.getPartnerIssues(profile.partner_id),
      DB.getLoveMap(profile.partner_id),
    ]);
  }

  Store.set({
    isLoggedIn: true,
    currentUser: profile,
    partnerUser,
    myIssues,
    myLoveMap: myMap,
    partnerIssues,
    partnerLoveMap: partnerMap,
    favorites: favs,
  });
  hideLoading();
}

/* ============================================================
   UTILS
   ============================================================ */
function copyPartnerCode() {
  const user = Store.get('currentUser');
  const code = user?.partner_code;
  if (!code) return;
  navigator.clipboard.writeText(code).then(() => showToast('코드가 복사됐어요! 📋'));
}

function exportData() {
  const blob = new Blob([JSON.stringify({
    exportedAt: new Date().toISOString(),
    myIssues: Store.get('myIssues')||[],
    myLoveMap: Store.get('myLoveMap')||[],
  }, null, 2)], { type:'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `lovemap_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  showToast('데이터가 저장됐어요!');
}

function genCode() {
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({length:6},()=>chars[Math.floor(Math.random()*chars.length)]).join('');
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  if (el) el.textContent = msg;
}

let toastTimer;
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:rgba(45,27,46,.9);color:white;padding:10px 20px;border-radius:9999px;font-size:14px;font-weight:500;z-index:9999;white-space:nowrap;backdrop-filter:blur(8px);transition:opacity .3s;pointer-events:none;font-family:'Noto Sans KR',sans-serif;`;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.style.opacity='0'; }, 2200);
}

/* ============================================================
   INIT
   ============================================================ */
async function init() {
  try {
    const user = await Auth.getUser();
    if (user) {
      showLoading('데이터 불러오는 중...');
      await loadUserSession(user.id);
      Router.navigate('home', { reset:true });
    } else {
      Router.navigate('login');
    }
  } catch {
    Router.navigate('login');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  Router.render();
  setTimeout(init, 1200);
});
