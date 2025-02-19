import { create } from 'zustand';

export type AuthState = {
  is_authenticated: boolean;
  username?: string;
};

type AuthStore = {
  auth: AuthState;
  setAuth: (auth: AuthState) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  auth: { is_authenticated: false },
  setAuth: (auth) => set({ auth }),
  clearAuth: () => set({ auth: { is_authenticated: false } }),
}));
