import { create } from 'zustand';
import { checkAuth as apiCheckAuth, logoutUser } from '@api/auth';

interface AuthState {
  isLoggedIn: boolean;
  email: string | null;
  /** 是否管理员；来自 /check/ 返回的 is_admin 字段 */
  isAdmin: boolean;
  /** 当前配额；-1 表示不限制 */
  quota: number;
  checked: boolean; // 是否已完成首次检查
  loading: boolean;
  setAuth: (email: string, opts?: { isAdmin?: boolean; quota?: number }) => void;
  clearAuth: () => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  email: null,
  isAdmin: false,
  quota: -1,
  checked: false,
  loading: false,

  setAuth: (email, opts) =>
    set({
      isLoggedIn: true,
      email,
      isAdmin: !!opts?.isAdmin,
      quota: typeof opts?.quota === 'number' ? opts.quota : -1,
      checked: true,
      loading: false,
    }),

  clearAuth: () =>
    set({
      isLoggedIn: false,
      email: null,
      isAdmin: false,
      quota: -1,
      checked: true,
      loading: false,
    }),

  checkAuth: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const res = await apiCheckAuth();
      if (res.loggedIn && res.email) {
        set({
          isLoggedIn: true,
          email: res.email,
          isAdmin: !!res.isAdmin,
          quota: typeof res.quota === 'number' ? res.quota : -1,
          checked: true,
          loading: false,
        });
      } else {
        set({
          isLoggedIn: false,
          email: null,
          isAdmin: false,
          quota: -1,
          checked: true,
          loading: false,
        });
      }
    } catch {
      set({
        isLoggedIn: false,
        email: null,
        isAdmin: false,
        quota: -1,
        checked: true,
        loading: false,
      });
    }
  },

  logout: async () => {
    await logoutUser();
    set({ isLoggedIn: false, email: null, isAdmin: false, quota: -1 });
    window.location.hash = '#/login';
  },
}));
