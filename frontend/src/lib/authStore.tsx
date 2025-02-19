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

const initialState: AuthState = {
  is_authenticated: false,
};

export const useAuthStore = create<AuthStore>((set) => ({
  auth: initialState,
  setAuth: (auth) => set({ auth }),
  clearAuth: () => set({ auth: initialState }),
}));
