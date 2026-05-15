/* ============================================================
   SUPABASE 클라이언트 설정
   ============================================================ */
const SUPABASE_URL = 'https://hggdvjtbiewgjkahwsnc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnZ2R2anRiaWV3Z2prYWh3c25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4Mjc1ODUsImV4cCI6MjA5NDQwMzU4NX0.82ZYiJR2b2e7v2ed0ljOQuR8bpMv11cq8H3091-YmI0';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ============================================================
   AUTH — 회원가입 / 로그인 / 로그아웃
   ============================================================ */
const Auth = {
  async signUp(email, password, name) {
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    return data.user;
  },

  async signIn(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  },

  async signOut() {
    await sb.auth.signOut();
  },

  async getUser() {
    const { data } = await sb.auth.getUser();
    return data?.user || null;
  },
};

/* ============================================================
   DB — 테이블별 CRUD
   ============================================================ */
const DB = {
  /* ── 프로필 ── */
  async getProfile(userId) {
    const { data, error } = await sb
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data;
  },

  async upsertProfile(profile) {
    const { data, error } = await sb
      .from('profiles')
      .upsert(profile, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getProfileByPartnerCode(code) {
    const { data, error } = await sb
      .from('profiles')
      .select('*')
      .eq('partner_code', code)
      .single();
    if (error) return null;
    return data;
  },

  /* ── 이슈 ── */
  async getMyIssues(userId) {
    const { data, error } = await sb
      .from('daily_issues')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  async getPartnerIssues(partnerId) {
    const { data, error } = await sb
      .from('daily_issues')
      .select('*')
      .eq('user_id', partnerId)
      .eq('notify_partner', true)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  async addIssue(issue) {
    const { data, error } = await sb
      .from('daily_issues')
      .insert(issue)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteIssue(id) {
    const { error } = await sb.from('daily_issues').delete().eq('id', id);
    if (error) throw error;
  },

  /* ── 뇌 지도 ── */
  async getLoveMap(userId) {
    const { data, error } = await sb
      .from('love_map_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error) return [];
    return data;
  },

  async addLoveMapEntry(entry) {
    const { data, error } = await sb
      .from('love_map_entries')
      .insert(entry)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteLoveMapEntry(id) {
    const { error } = await sb.from('love_map_entries').delete().eq('id', id);
    if (error) throw error;
  },

  /* ── 즐겨찾기 ── */
  async getFavorites(userId) {
    const { data, error } = await sb
      .from('favorites')
      .select('recommendation_id')
      .eq('user_id', userId);
    if (error) return [];
    return data.map(r => r.recommendation_id);
  },

  async toggleFavorite(userId, recId) {
    const { data } = await sb
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('recommendation_id', recId)
      .single();

    if (data) {
      await sb.from('favorites').delete().eq('id', data.id);
      return false;
    } else {
      await sb.from('favorites').insert({ user_id: userId, recommendation_id: recId });
      return true;
    }
  },
};
