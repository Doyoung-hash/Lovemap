/* ============================================================
   STORE — localStorage 기반 상태 관리
   ============================================================ */
const Store = (() => {
  const KEY = 'lovemap_v1';

  const defaultState = {
    isLoggedIn: false,
    currentUser: null,   // { id, name, email, partnerCode, partnerId, relationshipStartDate }
    partnerUser: null,   // { id, name, email, partnerCode }
    myIssues: [],        // DailyIssue[]
    partnerIssues: [],   // DailyIssue[]
    myLoveMap: [],       // LoveMapEntry[]
    partnerLoveMap: [],  // LoveMapEntry[]
    favorites: [],       // recommendation id[]
    settings: {
      notifyPartner: true,
      dailyReminder: true,
    },
  };

  let state = { ...defaultState };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state = { ...defaultState, ...parsed };
      }
    } catch (_) {
      state = { ...defaultState };
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (_) { /* quota exceeded — ignore */ }
  }

  function get(key) {
    return key ? state[key] : { ...state };
  }

  function set(updates) {
    state = { ...state, ...updates };
    save();
  }

  function reset() {
    state = { ...defaultState };
    localStorage.removeItem(KEY);
  }

  load();

  return { get, set, reset, save };
})();
