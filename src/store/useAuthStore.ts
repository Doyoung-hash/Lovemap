import { create } from 'zustand';
import { UserProfile } from '../types';
import { generateId, generatePartnerCode } from '../utils/dateHelpers';

interface AuthState {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  partnerUser: UserProfile | null;

  login: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  connectPartner: (code: string) => Promise<boolean>;
  disconnectPartner: () => void;
  setRelationshipStartDate: (date: string) => void;
}

const MOCK_PARTNER: UserProfile = {
  id: 'partner-001',
  name: '지수',
  email: 'partner@example.com',
  partnerCode: 'LOVE01',
  relationshipStartDate: '2023-02-14',
  partnerId: 'user-001',
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  currentUser: null,
  partnerUser: null,

  login: async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));

    const mockUser: UserProfile = {
      id: 'user-001',
      name: '민준',
      email,
      partnerCode: generatePartnerCode(),
      partnerId: 'partner-001',
      relationshipStartDate: '2023-02-14',
    };

    set({
      isAuthenticated: true,
      currentUser: mockUser,
      partnerUser: MOCK_PARTNER,
    });
    return true;
  },

  signUp: async (name: string, email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));

    const newUser: UserProfile = {
      id: generateId(),
      name,
      email,
      partnerCode: generatePartnerCode(),
    };

    set({ isAuthenticated: true, currentUser: newUser });
    return true;
  },

  logout: () => {
    set({ isAuthenticated: false, currentUser: null, partnerUser: null });
  },

  updateProfile: (updates) => {
    const { currentUser } = get();
    if (!currentUser) return;
    set({ currentUser: { ...currentUser, ...updates } });
  },

  connectPartner: async (code: string) => {
    await new Promise((r) => setTimeout(r, 600));

    if (code.toUpperCase() === 'LOVE01') {
      set({ partnerUser: MOCK_PARTNER });
      return true;
    }
    return false;
  },

  disconnectPartner: () => {
    const { currentUser } = get();
    if (!currentUser) return;
    set({
      partnerUser: null,
      currentUser: { ...currentUser, partnerId: undefined },
    });
  },

  setRelationshipStartDate: (date: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    set({ currentUser: { ...currentUser, relationshipStartDate: date } });
  },
}));
