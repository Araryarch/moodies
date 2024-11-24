import { create } from 'zustand'

interface AuthState {
  jwtToken: string | null
  setJwtToken: (token: string) => void
  clearJwtToken: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  jwtToken: null,
  setJwtToken: (token) => set({ jwtToken: token }),
  clearJwtToken: () => set({ jwtToken: null })
}))
