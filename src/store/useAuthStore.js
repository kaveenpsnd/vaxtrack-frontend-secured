import { create } from 'zustand';
import { logoutUser as logoutApi } from '../api/authApi';

if (typeof window !== 'undefined') {
  localStorage.removeItem('auth-storage');
}

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),

  logout: async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout API failed', error);
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  checkAuth: async (getProfileFunc) => {
    try {
      const res = await getProfileFunc();
      set({ user: res.data, isAuthenticated: true });
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    }
  }
}));

export default useAuthStore;