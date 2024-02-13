import create from 'zustand';
import { AuthStore } from '@/app/lib/definitions';

// Définir un store Zustand pour gérer l'état de l'authentification
const useAuthStore = create<AuthStore> (set => ({
  token: null,
  setToken: (newToken) => set({ token: newToken }),
}));

export default useAuthStore;
