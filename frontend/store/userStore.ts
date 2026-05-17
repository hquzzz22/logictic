import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
}

interface UserState {
  userInfo: UserInfo | null;
  setUserInfo: (user: UserInfo) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userInfo: null,
      setUserInfo: (user) => {
        set({ userInfo: user });
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', user.token);
        }
      },
      logout: () => {
        set({ userInfo: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user-storage');
        }
      },
    }),
    {
      name: 'user-storage',
      // Sau khi Zustand hydrate từ localStorage, sync token ra để axios dùng
      onRehydrateStorage: () => (state) => {
        if (state?.userInfo?.token && typeof window !== 'undefined') {
          localStorage.setItem('token', state.userInfo.token);
        }
      },
    }
  )
);
