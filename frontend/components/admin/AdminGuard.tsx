'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const userInfo = useUserStore((state) => state.userInfo);
  // Chờ Zustand hydrate từ localStorage xong mới kiểm tra
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Zustand persist cần 1 tick để đọc localStorage và hydrate store
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return; // Chưa hydrate xong, chưa redirect
    if (!userInfo) {
      router.replace('/login');
    } else if (!userInfo.isAdmin) {
      router.replace('/');
    }
  }, [hydrated, userInfo, router]);

  // Đang chờ hydrate — hiển thị loading
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Đã hydrate nhưng chưa có user hoặc không phải admin — đang redirect
  if (!userInfo || !userInfo.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
