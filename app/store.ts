import { create } from 'zustand'

export const useStore = create(set => ({
  jwt: '',
  setJwt: (jwt: string) => set({ jwt }),
}));
