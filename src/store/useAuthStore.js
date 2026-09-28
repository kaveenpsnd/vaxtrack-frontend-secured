import { create } from 'zustand';
import { logoutUser as logoutApi } from '../api/authApi';

if (typeof window !== 'undefined') {
  localStorage.removeItem('auth-storage');
}

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  login: (user) => set({ user, isAuthenticated: true, isCheckingAuth: false }),
  logout: async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },
  checkAuth: async (getProfileFunc) => {
    try {
      const res = await getProfileFunc();
      const user = res.data;
      if (user) {
        set({ user, isAuthenticated: true, isCheckingAuth: false });
        return user;
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },
}));

export default useAuthStore;
