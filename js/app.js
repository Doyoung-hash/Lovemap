/* ============================================================
   APP.JS — LoveMap 메인 애플리케이션
   라우터 + 모든 화면 + 이벤트 핸들러
   ============================================================ */

/* ── UI 상태 (탐색 중 임시 상태) ── */
const ui = {
  loveMapTab: 'my',         // 'my' | 'partner' | 'quiz'
  loveMapCategory: null,    // null | category key
  loveMapView: 'grid',      // 'grid' | 'detail'
  guideTab: 'personal',     // 'personal' | 'couple'
  quizIndex: 0,
  quizAnswers: {},
  quizDone: false,
  selectedEmotions: [],
  starRating: 3,
  notifyPartner: true,
  starterIndex: 0,
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
    const html = SCREENS[this.screen] ? SCREENS[this.screen]() : renderNotFound();
    app.innerHTML = html;
    onScreenMounted(this.screen);
  },
};

/* ============================================================
   SCREENS
   ============================================================ */
const SCREENS = {
  splash:          renderSplash,
  login:           renderLogin,
  signup:          renderSignup,
  partnerConnect:  renderPartnerConnect,
  profileSetup:    renderProfileSetup,
  home:            renderHome,
  loveMap:         renderLoveMap,
  dashboard:       renderDashboard,
  guide:           renderGuide,
  settings:        renderSettings,
};

/* ── Bottom Nav HTML ── */
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

/* ─────────────────────────────────────────
   1. SPLASH
   ───────────────────────────────────────── */
function renderSplash() {
  return `
    <div class="screen splash-screen">
      <div class="splash-logo">💕</div>
      <div class="splash-title">사랑의 지도</div>
      <div class="splash-subtitle">Love Map by Gottman</div>
      <div class="splash-dots">
        <span></span><span></span><span></span>
      </div>
    </div>`;
}

/* ─────────────────────────────────────────
   2. LOGIN
   ───────────────────────────────────────── */
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
        <button class="btn btn-primary" id="btn-login">시작하기 →</button>
        <div class="auth-divider"><span>또는</span></div>
        <div class="auth-footer">
          처음이세요?
          <button data-goto="signup">회원가입</button>
        </div>
      </div>
    </div>`;
}

/* ─────────────────────────────────────────
   3. SIGNUP
   ───────────────────────────────────────── */
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
        <button class="btn btn-primary" id="btn-signup">가입하기 →</button>
        <div class="auth-footer">
          이미 계정이 있으신가요?
          <button data-goto="login">로그인</button>
        </div>
      </div>
    </div>`;
}

/* ─────────────────────────────────────────
   4. PARTNER CONNECT
   ───────────────────────────────────────── */
function renderPartnerConnect() {
  const user = Store.get('currentUser');
  const code = user ? user.partnerCode : '------';
  return `
    <div class="screen">
      <div class="gradient-header">
        <span class="emoji">🔗</span>
        <h1>파트너 연결</h1>
        <p>서로의 초대 코드를 공유하세요</p>
      </div>
      <div class="onboarding-body">
        <div class="code-step">
          <p>아래 코드를 파트너에게 공유하거나,<br>파트너의 코드를 입력하세요</p>
          <div class="code-box">
            <div class="code-label">나의 초대 코드</div>
            <div class="code-value">${code}</div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">파트너 코드 입력</label>
          <input class="form-input" type="text" id="partner-code-input"
            placeholder="6자리 코드 입력" maxlength="6"
            style="text-align:center;letter-spacing:4px;font-size:20px;font-weight:700;text-transform:uppercase">
        </div>
        <div id="partner-msg" style="text-align:center;font-size:13px;color:var(--error);margin-bottom:8px;min-height:18px"></div>
        <button class="btn btn-primary" id="btn-connect-partner">연결하기</button>
        <div style="margin-top:12px">
          <button class="btn btn-ghost" id="btn-skip-partner" style="width:100%;color:var(--text3)">나중에 연결하기</button>
        </div>
      </div>
    </div>`;
}

/* ─────────────────────────────────────────
   5. PROFILE SETUP
   ───────────────────────────────────────── */
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
          <div class="profile-avatar-large">${user ? user.name.charAt(0) : '?'}</div>
          <div style="font-size:18px;font-weight:700;color:var(--text)">${user ? user.name : ''}</div>
        </div>
        <div class="form-group">
          <label class="form-label">이름 수정</label>
          <input class="form-input" type="text" id="profile-name"
            value="${user ? user.name : ''}" placeholder="이름을 입력하세요">
        </div>
        <div class="form-group">
          <label class="form-label">관계 시작일 💕</label>
          <input class="form-input" type="date" id="profile-date"
            value="" max="${today}">
        </div>
        <button class="btn btn-primary mt-20" id="btn-save-profile">시작하기 🚀</button>
      </div>
    </div>`;
}

/* ─────────────────────────────────────────
   6. HOME
   ───────────────────────────────────────── */
function renderHome() {
  const user = Store.get('currentUser');
  const partner = Store.get('partnerUser');
  const myIssues = Store.get('myIssues') || [];
  const partnerIssues = Store.get('partnerIssues') || [];
  const last7 = getLast7DaysIssues(myIssues);
  const duration = user?.relationshipStartDate ? getRelationshipDuration(user.relationshipStartDate) : null;

  const today = new Date().toDateString();
  const todayIssue = myIssues.find(i => new Date(i.createdAt).toDateString() === today);

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
        ${partner ? `
          <div class="home-partner-chip">
            💑 ${partner.name}과 함께
          </div>` : ''}
      </div>

      <div class="screen-body">
        <!-- 오늘의 이슈 입력 -->
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
            <div class="emotion-grid" id="emotion-grid">
              ${EMOTIONS.map(e => `
                <button class="emotion-tag ${ui.selectedEmotions.includes(e.key) ? 'selected' : ''}"
                  data-emotion="${e.key}"
                  style="${ui.selectedEmotions.includes(e.key) ? `background:${e.color}` : ''}">
                  ${e.emoji} ${e.label}
                </button>
              `).join('')}
            </div>
          </div>

          <div style="margin:12px 0 8px">
            <div class="form-label">중요도</div>
            <div class="star-rating" id="star-rating">
              ${[1,2,3,4,5].map(n => `
                <span class="star ${n <= ui.starRating ? 'active' : ''}" data-star="${n}">⭐</span>
              `).join('')}
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

        <!-- 대화 스타터 -->
        <div class="section-header">
          <div class="section-title">💬 대화 스타터</div>
          <button class="section-link" id="btn-shuffle-starter">새로고침</button>
        </div>
        ${renderStarterCard()}

        <!-- 7일 타임라인 -->
        <div class="section-header">
          <div class="section-title">지난 7일간 이슈</div>
          <span style="font-size:12px;color:var(--text3)">${last7.length}개</span>
        </div>
        ${renderTimeline(last7)}

        <!-- 파트너 이슈 미리보기 -->
        ${partner ? `
          <div class="section-header">
            <div class="section-title">${partner.name}의 최근 이슈</div>
          </div>
          ${renderPartnerPreview(partner, partnerIssues)}
        ` : ''}
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
    const d = new Date(issue.createdAt);
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
            <div class="timeline-time">${formatTime(issue.createdAt)}</div>
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
          <div class="partner-updated">${latest ? formatDate(latest.createdAt) + '에 업데이트' : '아직 기록 없음'}</div>
        </div>
      </div>
      ${latest ? `
        <div class="partner-issue-preview">"${escHtml(latest.content)}"</div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:8px">
          ${latest.emotions.map(ek => {
            const em = getEmotionInfo(ek);
            return `<span class="mini-tag" style="background:${em.color}">${em.emoji} ${em.label}</span>`;
          }).join('')}
        </div>
      ` : '<div style="font-size:13px;color:var(--text3)">파트너가 아직 이슈를 입력하지 않았어요</div>'}
    </div>`;
}

/* ─────────────────────────────────────────
   7. LOVE MAP
   ───────────────────────────────────────── */
function renderLoveMap() {
  const user = Store.get('currentUser');
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

        ${ui.loveMapTab === 'quiz' ? renderQuiz(partner, partnerMap) : renderCategoryGrid(ui.loveMapTab, myMap, partnerMap)}
      </div>

      ${renderBottomNav('loveMap')}
    </div>`;
}

function renderCategoryGrid(tab, myMap, partnerMap) {
  const map = tab === 'my' ? myMap : partnerMap;
  return `
    <div class="category-grid">
      ${CATEGORIES.map(cat => {
        const count = map.filter(e => e.category === cat.key).length;
        return `
          <button class="category-card" data-category="${cat.key}"
            style="background:${cat.color};border-color:${cat.accent}22">
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
            <div style="font-size:11px;color:var(--text3);font-weight:600;text-transform:uppercase">${isReadOnly ? (partner?.name||'파트너') + '의 지도' : '내 지도'}</div>
            <div class="category-detail-title">${cat.emoji} ${cat.label}</div>
          </div>
        </div>
      </div>

      <div class="screen-body no-nav" style="padding-bottom: calc(var(--nav-height) + 16px)">
        ${entries.length === 0 ? `
          <div class="no-content">
            <div class="no-content-emoji">${cat.emoji}</div>
            <p>${isReadOnly ? `${partner?.name||'파트너'}가 아직 입력하지 않았어요` : '아직 기록이 없어요.<br>첫 번째 항목을 추가해보세요!'}</p>
          </div>` : ''}

        ${entries.map(e => `
          <div class="entry-item">
            <div class="entry-text">${escHtml(e.content)}</div>
            ${!isReadOnly ? `<button class="entry-delete" data-delete-entry="${e.id}">✕</button>` : ''}
          </div>
        `).join('')}

        ${!isReadOnly ? `
          <div class="add-entry-row">
            <input class="add-entry-input" id="new-entry-input"
              placeholder="${cat.examples ? '예: ' + cat.examples[0] : '내용을 입력하세요'}"
              maxlength="60">
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
        <button class="btn btn-primary btn-sm mt-16" style="width:160px;margin:16px auto 0" data-goto="settings">파트너 연결</button>
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
        <div class="quiz-result-sub">
          ${total}문제 중 ${correct}개 맞췄어요.<br>
          파트너의 뇌지도를 채우면 더 높은 점수를 받을 수 있어요!
        </div>
        <button class="btn btn-primary mt-20" id="btn-retry-quiz">다시 도전하기</button>
      </div>`;
  }

  const q = QUIZ_QUESTIONS[ui.quizIndex];
  const cat = getCategoryInfo(q.category);
  const entries = partnerMap.filter(e => e.category === q.category);
  const hint = entries.length > 0
    ? `파트너의 ${cat.label}에서 힌트를 얻어보세요 😉`
    : `파트너의 ${cat.label}에 아직 기록이 없어요`;

  return `
    <div class="quiz-card">
      <div class="quiz-progress-bar">
        <div class="quiz-progress-fill" style="width:${(ui.quizIndex / QUIZ_QUESTIONS.length) * 100}%"></div>
      </div>
      <div class="quiz-emoji">${cat.emoji}</div>
      <div class="quiz-category-badge">${cat.label} · ${ui.quizIndex + 1}/${QUIZ_QUESTIONS.length}</div>
      <div class="quiz-question">${partner.name}의 "${q.q}"</div>
      <input class="quiz-input" id="quiz-answer" placeholder="답을 입력하세요...">
      <div class="quiz-hint">${hint}</div>
      <button class="btn btn-primary" id="btn-quiz-next">
        ${ui.quizIndex < QUIZ_QUESTIONS.length - 1 ? '다음 →' : '결과 보기 🎉'}
      </button>
    </div>`;
}

/* ─────────────────────────────────────────
   8. DASHBOARD
   ───────────────────────────────────────── */
function renderDashboard() {
  const partner = Store.get('partnerUser');
  const myIssues = Store.get('myIssues') || [];
  const partnerIssues = Store.get('partnerIssues') || [];
  const myTop = extractTopKeywords(myIssues, 10);
  const partnerTop = extractTopKeywords(partnerIssues, 10);

  const myKeywords = myTop.map(i => i.keyword);
  const partnerKeywords = partnerTop.map(i => i.keyword);
  const common = myKeywords.filter(k => partnerKeywords.includes(k)).slice(0, 5);

  const maxMy = myTop[0]?.count || 1;
  const maxPartner = partnerTop[0]?.count || 1;

  return `
    <div class="screen">
      <div style="padding:52px 16px 16px;background:linear-gradient(135deg,#FF9A3C,#FF6B9D);color:white;flex-shrink:0">
        <h2 style="font-size:22px;font-weight:800">📊 이슈 TOP 10</h2>
        <p style="font-size:13px;opacity:.85;margin-top:4px">최근 이슈를 빈도순으로 분석했어요</p>
      </div>

      <div class="screen-body">
        <!-- 공통 이슈 -->
        ${common.length > 0 ? `
          <div class="card" style="background:linear-gradient(135deg,rgba(255,107,157,.06),rgba(199,125,255,.06));border-color:rgba(255,107,157,.25)">
            <div class="card-title">💑 공통 이슈</div>
            <div class="common-issues">
              ${common.map(k => `<span class="common-chip">${k}</span>`).join('')}
            </div>
          </div>` : ''}

        <!-- 나의 TOP 10 -->
        <div class="section-header">
          <div class="section-title">나의 TOP 10</div>
          <span style="font-size:12px;color:var(--text3)">${myIssues.length}개 기록</span>
        </div>
        ${myTop.length > 0 ? `
          <div class="rank-list">
            ${myTop.map((item, i) => renderRankItem(item, i, maxMy)).join('')}
          </div>` : `
          <div class="no-content">
            <div class="no-content-emoji">📝</div>
            <p>아직 이슈 기록이 없어요.<br>홈에서 이슈를 입력해보세요!</p>
          </div>`}

        <!-- 파트너 TOP 10 -->
        ${partner ? `
          <div class="section-header" style="margin-top:20px">
            <div class="section-title">${partner.name}의 TOP 10</div>
            <span style="font-size:12px;color:var(--text3)">${partnerIssues.length}개 기록</span>
          </div>
          ${partnerTop.length > 0 ? `
            <div class="rank-list">
              ${partnerTop.map((item, i) => renderRankItem(item, i, maxPartner, true)).join('')}
            </div>` : `
            <div class="no-content">
              <div class="no-content-emoji">💤</div>
              <p>파트너가 아직 이슈를 입력하지 않았어요</p>
            </div>`}
        ` : ''}
      </div>

      ${renderBottomNav('dashboard')}
    </div>`;
}

function renderRankItem(item, index, maxCount, isPartner = false) {
  const rankClass = index === 0 ? 'top1' : index === 1 ? 'top2' : index === 2 ? 'top3' : 'rest';
  const barWidth = Math.round(item.count / maxCount * 100);
  return `
    <div class="rank-item">
      <div class="rank-num ${rankClass}">${index + 1}</div>
      <div class="rank-content">
        <div class="rank-keyword">${escHtml(item.keyword)}</div>
        <div class="rank-bar-wrap">
          <div class="rank-bar" style="width:${barWidth}%;background:${isPartner ? 'linear-gradient(90deg,#C77DFF,#FF6B9D)' : 'linear-gradient(90deg,#FF6B9D,#C77DFF)'}"></div>
        </div>
      </div>
      <div class="rank-count">${item.count}회</div>
    </div>`;
}

/* ─────────────────────────────────────────
   9. GUIDE
   ───────────────────────────────────────── */
function renderGuide() {
  const myIssues = Store.get('myIssues') || [];
  const favorites = Store.get('favorites') || [];
  const recent = getLast7DaysIssues(myIssues);
  const tab = ui.guideTab;

  const recs = tab === 'personal'
    ? scoreRecommendations(RECOMMENDATIONS.personal, recent)
    : scoreRecommendations(RECOMMENDATIONS.couple, recent);

  return `
    <div class="screen">
      <div style="padding:52px 16px 16px;background:linear-gradient(135deg,#63E6BE,#4299E1);color:white;flex-shrink:0">
        <h2 style="font-size:22px;font-weight:800">💆 스트레스 해소</h2>
        <p style="font-size:13px;opacity:.85;margin-top:4px">나의 이슈에 맞춤 추천이에요</p>
      </div>

      <div class="screen-body">
        <div class="tab-bar">
          <button class="tab-item ${tab==='personal'?'active':''}" data-guidetab="personal">개인 해소법</button>
          <button class="tab-item ${tab==='couple'?'active':''}" data-guidetab="couple">커플 해소법</button>
        </div>

        ${recs.map(rec => `
          <div class="guide-card">
            <div class="guide-icon">${rec.icon}</div>
            <div class="guide-content">
              <span class="guide-duration ${getDurationClass(rec.duration)}">${getDurationLabel(rec.duration)}</span>
              <div class="guide-title">${rec.title}</div>
              <div class="guide-desc">${rec.desc}</div>
            </div>
            <button class="guide-fav" data-fav="${rec.id}">
              ${favorites.includes(rec.id) ? '❤️' : '🤍'}
            </button>
          </div>
        `).join('')}

        ${favorites.length > 0 ? `
          <div class="section-header" style="margin-top:8px">
            <div class="section-title">❤️ 즐겨찾기</div>
          </div>
          ${[...RECOMMENDATIONS.personal, ...RECOMMENDATIONS.couple]
            .filter(r => favorites.includes(r.id))
            .map(rec => `
              <div class="guide-card" style="border-color:rgba(255,107,157,.4);background:rgba(255,107,157,.03)">
                <div class="guide-icon">${rec.icon}</div>
                <div class="guide-content">
                  <span class="guide-duration ${getDurationClass(rec.duration)}">${getDurationLabel(rec.duration)}</span>
                  <div class="guide-title">${rec.title}</div>
                  <div class="guide-desc">${rec.desc}</div>
                </div>
                <button class="guide-fav" data-fav="${rec.id}">❤️</button>
              </div>`).join('')}
        ` : ''}
      </div>

      ${renderBottomNav('guide')}
    </div>`;
}

/* ─────────────────────────────────────────
   10. SETTINGS
   ───────────────────────────────────────── */
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
        <!-- 프로필 -->
        <div class="profile-section">
          <div class="profile-avatar-large">${user?.name?.charAt(0) || '?'}</div>
          <div class="profile-display-name">${user?.name || '사용자'}</div>
          <div class="profile-email">${user?.email || ''}</div>
          ${user?.relationshipStartDate ? `
            <div style="margin-top:8px">
              <span class="badge badge-primary">${getRelationshipDuration(user.relationshipStartDate)}</span>
            </div>` : ''}
        </div>

        <!-- 초대 코드 -->
        ${user?.partnerCode ? `
          <div class="settings-section">
            <div class="settings-section-title">나의 초대 코드</div>
            <div class="code-box">
              <div class="code-label">파트너에게 공유하세요</div>
              <div class="code-value">${user.partnerCode}</div>
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
                <div class="settings-item-subtitle">연결됨</div>
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
                <div class="toggle-sublabel">이슈 저장 시 파트너에게 알림</div>
              </div>
              <label class="toggle">
                <input type="checkbox" id="set-notify" ${settings.notifyPartner ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="divider"></div>
            <div class="toggle-row">
              <div>
                <div class="toggle-label">매일 리마인더</div>
                <div class="toggle-sublabel">오늘의 이슈 입력 알림</div>
              </div>
              <label class="toggle">
                <input type="checkbox" id="set-reminder" ${settings.dailyReminder ? 'checked' : ''}>
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

        <!-- 로그아웃 -->
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
      <div style="font-size:48px;margin-bottom:12px">🤔</div>
      <p>페이지를 찾을 수 없어요</p>
    </div>
  </div>`;
}

/* ============================================================
   EVENT HANDLERS
   ============================================================ */
function onScreenMounted(screen) {
  if (screen === 'home') {
    syncIssueInput();
    syncStarRating();
  }
}

function syncIssueInput() {
  const el = document.getElementById('issue-input');
  const cc = document.getElementById('char-count');
  if (el && cc) {
    cc.textContent = el.value.length;
    el.addEventListener('input', () => { cc.textContent = el.value.length; });
  }
}

function syncStarRating() {
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    const n = parseInt(star.dataset.star);
    star.classList.toggle('active', n <= ui.starRating);
  });
}

document.addEventListener('click', function (e) {
  const target = e.target.closest('[data-nav], [data-goto], [data-emotion], [data-star], [data-lmtab], [data-guidetab], [data-category], [data-delete-entry], [data-example], [data-fav], #btn-login, #btn-signup, #btn-connect-partner, #btn-skip-partner, #btn-save-profile, #btn-submit-issue, #starter-card, #btn-shuffle-starter, #btn-cat-back, #btn-add-entry, #btn-quiz-next, #btn-retry-quiz, #btn-logout, #btn-disconnect, #btn-goto-connect, #btn-export, #btn-retry-quiz');
  if (!target) return;

  /* ── Navigation ── */
  if (target.dataset.nav) {
    ui.loveMapView = 'grid';
    ui.loveMapCategory = null;
    Router.navigate(target.dataset.nav);
    return;
  }

  if (target.dataset.goto) {
    Router.navigate(target.dataset.goto);
    return;
  }

  /* ── Emotion tag ── */
  if (target.dataset.emotion) {
    const ek = target.dataset.emotion;
    const idx = ui.selectedEmotions.indexOf(ek);
    if (idx >= 0) ui.selectedEmotions.splice(idx, 1);
    else ui.selectedEmotions.push(ek);
    const em = getEmotionInfo(ek);
    target.classList.toggle('selected');
    if (ui.selectedEmotions.includes(ek)) {
      target.style.background = em.color;
      target.style.color = 'white';
      target.style.borderColor = 'transparent';
    } else {
      target.style.background = '';
      target.style.color = '';
      target.style.borderColor = '';
    }
    return;
  }

  /* ── Star rating ── */
  if (target.dataset.star) {
    ui.starRating = parseInt(target.dataset.star);
    syncStarRating();
    return;
  }

  /* ── Login ── */
  if (target.id === 'btn-login') {
    const email = document.getElementById('login-email')?.value?.trim();
    const pw = document.getElementById('login-pw')?.value;
    if (!email || !pw) return showToast('이메일과 비밀번호를 입력해주세요');
    doLogin(email);
    return;
  }

  /* ── Signup ── */
  if (target.id === 'btn-signup') {
    const name = document.getElementById('signup-name')?.value?.trim();
    const email = document.getElementById('signup-email')?.value?.trim();
    const pw = document.getElementById('signup-pw')?.value;
    if (!name || !email || !pw) return showToast('모든 항목을 입력해주세요');
    if (pw.length < 6) return showToast('비밀번호는 6자 이상이어야 해요');
    doSignup(name, email);
    return;
  }

  /* ── Partner connect ── */
  if (target.id === 'btn-connect-partner') {
    const code = document.getElementById('partner-code-input')?.value?.trim().toUpperCase();
    if (!code) return showToast('코드를 입력해주세요');
    const msg = document.getElementById('partner-msg');
    if (code === 'LOVE01' || code.length === 6) {
      Store.set({ partnerUser: { id: 'partner-001', name: '지수', email: 'partner@example.com', partnerCode: code } });
      Store.set({ partnerIssues: SAMPLE_PARTNER_ISSUES, partnerLoveMap: SAMPLE_PARTNER_LOVEMAP });
      showToast('파트너와 연결됐어요! 💕');
      setTimeout(() => Router.navigate('profileSetup'), 800);
    } else {
      if (msg) msg.textContent = '코드를 찾을 수 없어요. 다시 확인해주세요.';
    }
    return;
  }

  if (target.id === 'btn-skip-partner') {
    Router.navigate('profileSetup');
    return;
  }

  /* ── Profile save ── */
  if (target.id === 'btn-save-profile') {
    const name = document.getElementById('profile-name')?.value?.trim();
    const date = document.getElementById('profile-date')?.value;
    const user = Store.get('currentUser');
    Store.set({ currentUser: { ...user, name: name || user?.name, relationshipStartDate: date || undefined } });
    Router.navigate('home', { reset: true });
    return;
  }

  /* ── Submit issue ── */
  if (target.id === 'btn-submit-issue') {
    const content = document.getElementById('issue-input')?.value?.trim();
    if (!content) return showToast('이슈 내용을 입력해주세요');
    if (ui.selectedEmotions.length === 0) return showToast('감정 태그를 하나 이상 선택해주세요');
    const notify = document.getElementById('notify-toggle')?.checked ?? ui.notifyPartner;
    const myIssues = Store.get('myIssues') || [];
    const today = new Date().toDateString();
    const filtered = myIssues.filter(i => new Date(i.createdAt).toDateString() !== today);
    const newIssue = {
      id: generateId(),
      content,
      emotions: [...ui.selectedEmotions],
      importance: ui.starRating,
      createdAt: new Date().toISOString(),
      notifyPartner: notify,
    };
    Store.set({ myIssues: [newIssue, ...filtered] });
    ui.selectedEmotions = [];
    ui.starRating = 3;
    showToast('저장됐어요! 💕');
    setTimeout(() => Router.navigate('home'), 600);
    return;
  }

  /* ── Conversation starter ── */
  if (target.id === 'starter-card' || target.id === 'btn-shuffle-starter' || target.closest('#starter-card')) {
    ui.starterIndex = (ui.starterIndex + 1) % CONVERSATION_STARTERS.length;
    const card = document.getElementById('starter-card');
    if (card) {
      const s = CONVERSATION_STARTERS[ui.starterIndex % CONVERSATION_STARTERS.length];
      card.innerHTML = `
        <div class="starter-emoji">${s.emoji}</div>
        <div class="starter-text">"${s.text}"</div>
        <div class="starter-hint">탭하면 새 질문이 나와요</div>`;
    }
    return;
  }

  /* ── Love Map tab ── */
  if (target.dataset.lmtab) {
    ui.loveMapTab = target.dataset.lmtab;
    if (target.dataset.lmtab === 'quiz') { ui.quizIndex = 0; ui.quizAnswers = {}; ui.quizDone = false; }
    ui.loveMapView = 'grid';
    ui.loveMapCategory = null;
    Router.navigate('loveMap');
    return;
  }

  /* ── Category card ── */
  if (target.dataset.category) {
    ui.loveMapCategory = target.dataset.category;
    ui.loveMapView = 'detail';
    Router.navigate('loveMap');
    return;
  }

  /* ── Category back ── */
  if (target.id === 'btn-cat-back') {
    ui.loveMapView = 'grid';
    ui.loveMapCategory = null;
    Router.navigate('loveMap');
    return;
  }

  /* ── Add entry ── */
  if (target.id === 'btn-add-entry') {
    addLoveMapEntry();
    return;
  }

  /* ── Example chip ── */
  if (target.dataset.example) {
    const input = document.getElementById('new-entry-input');
    if (input) { input.value = target.dataset.example; input.focus(); }
    return;
  }

  /* ── Delete entry ── */
  if (target.dataset.deleteEntry) {
    const id = target.dataset.deleteEntry;
    const myMap = Store.get('myLoveMap') || [];
    Store.set({ myLoveMap: myMap.filter(e => e.id !== id) });
    Router.navigate('loveMap');
    return;
  }

  /* ── Quiz next ── */
  if (target.id === 'btn-quiz-next') {
    const answer = document.getElementById('quiz-answer')?.value?.trim();
    if (!answer) return showToast('답을 입력해주세요');
    const q = QUIZ_QUESTIONS[ui.quizIndex];
    const partnerMap = Store.get('partnerLoveMap') || [];
    const entries = partnerMap.filter(e => e.category === q.category);
    const isCorrect = entries.some(e => e.content.includes(answer) || answer.includes(e.content.slice(0, 3)));
    ui.quizAnswers[ui.quizIndex] = { answer, isCorrect };

    if (ui.quizIndex < QUIZ_QUESTIONS.length - 1) {
      ui.quizIndex++;
    } else {
      ui.quizDone = true;
    }
    Router.navigate('loveMap');
    return;
  }

  /* ── Retry quiz ── */
  if (target.id === 'btn-retry-quiz') {
    ui.quizIndex = 0;
    ui.quizAnswers = {};
    ui.quizDone = false;
    Router.navigate('loveMap');
    return;
  }

  /* ── Guide tab ── */
  if (target.dataset.guidetab) {
    ui.guideTab = target.dataset.guidetab;
    Router.navigate('guide');
    return;
  }

  /* ── Favorite toggle ── */
  if (target.dataset.fav) {
    const id = target.dataset.fav;
    const favs = Store.get('favorites') || [];
    const idx = favs.indexOf(id);
    if (idx >= 0) favs.splice(idx, 1);
    else favs.push(id);
    Store.set({ favorites: [...favs] });
    target.textContent = favs.includes(id) ? '❤️' : '🤍';
    return;
  }

  /* ── Settings: disconnect partner ── */
  if (target.id === 'btn-disconnect') {
    if (confirm('파트너 연결을 해제할까요?')) {
      Store.set({ partnerUser: null, partnerIssues: [], partnerLoveMap: [] });
      Router.navigate('settings');
    }
    return;
  }

  /* ── Settings: goto partner connect ── */
  if (target.id === 'btn-goto-connect') {
    Router.navigate('partnerConnect');
    return;
  }

  /* ── Settings: export ── */
  if (target.id === 'btn-export') {
    exportData();
    return;
  }

  /* ── Logout ── */
  if (target.id === 'btn-logout') {
    if (confirm('로그아웃 하시겠어요?')) {
      Store.reset();
      Router.navigate('login', { reset: true });
    }
    return;
  }
});

/* ── Enter key on inputs ── */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    if (document.getElementById('new-entry-input') === e.target) {
      addLoveMapEntry();
    }
    if (document.getElementById('quiz-answer') === e.target) {
      document.getElementById('btn-quiz-next')?.click();
    }
    if (document.getElementById('partner-code-input') === e.target) {
      document.getElementById('btn-connect-partner')?.click();
    }
    if (document.getElementById('login-email') === e.target || document.getElementById('login-pw') === e.target) {
      document.getElementById('btn-login')?.click();
    }
  }
});

/* ── Settings toggles ── */
document.addEventListener('change', function (e) {
  if (e.target.id === 'set-notify') {
    const settings = Store.get('settings') || {};
    Store.set({ settings: { ...settings, notifyPartner: e.target.checked } });
  }
  if (e.target.id === 'set-reminder') {
    const settings = Store.get('settings') || {};
    Store.set({ settings: { ...settings, dailyReminder: e.target.checked } });
  }
  if (e.target.id === 'notify-toggle') {
    ui.notifyPartner = e.target.checked;
  }
});

/* ============================================================
   HELPERS
   ============================================================ */
function doLogin(email) {
  const code = genCode();
  Store.set({
    isLoggedIn: true,
    currentUser: { id: 'user-001', name: '민준', email, partnerCode: code },
    partnerUser: null,
    myIssues: Store.get('myIssues') || [],
  });
  Router.navigate('partnerConnect');
}

function doSignup(name, email) {
  const code = genCode();
  Store.set({
    isLoggedIn: true,
    currentUser: { id: generateId(), name, email, partnerCode: code },
    myIssues: [],
  });
  Router.navigate('partnerConnect');
}

function addLoveMapEntry() {
  const input = document.getElementById('new-entry-input');
  const text = input?.value?.trim();
  if (!text) return showToast('내용을 입력해주세요');
  const myMap = Store.get('myLoveMap') || [];
  myMap.push({ id: generateId(), category: ui.loveMapCategory, content: text, createdAt: new Date().toISOString() });
  Store.set({ myLoveMap: myMap });
  showToast('추가됐어요!');
  Router.navigate('loveMap');
}

function exportData() {
  const data = {
    exportedAt: new Date().toISOString(),
    myIssues: Store.get('myIssues') || [],
    myLoveMap: Store.get('myLoveMap') || [],
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lovemap_data_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('데이터가 저장됐어요!');
}

function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

let toastTimer;
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position:fixed;bottom:90px;left:50%;transform:translateX(-50%);
      background:rgba(45,27,46,.9);color:white;padding:10px 20px;
      border-radius:9999px;font-size:14px;font-weight:500;
      z-index:9999;white-space:nowrap;backdrop-filter:blur(8px);
      transition:opacity .3s;pointer-events:none;max-width:300px;
      font-family:'Noto Sans KR',sans-serif;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.style.opacity = '0'; }, 2200);
}

/* ============================================================
   INIT
   ============================================================ */
function init() {
  const isLoggedIn = Store.get('isLoggedIn');
  if (isLoggedIn) {
    Router.navigate('home', { reset: true });
  } else {
    setTimeout(() => Router.navigate('login'), 1500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  Router.render();
  init();
});
