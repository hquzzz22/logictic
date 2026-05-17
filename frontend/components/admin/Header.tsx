'use client';

import { usePathname } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { User, Bell } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/products': 'Quản lý sản phẩm',
  '/admin/categories': 'Quản lý danh mục',
  '/admin/orders': 'Quản lý đơn hàng',
  '/admin/posts': 'Quản lý bài viết',
  '/admin/posts/new': 'Viết bài mới',
  '/admin/post-categories': 'Danh mục bài viết',
  '/admin/users': 'Quản lý người dùng',
  '/admin/settings': 'Cài đặt',
};

export default function AdminHeader() {
  const pathname = usePathname();
  const userInfo = useUserStore((state) => state.userInfo);

  const title = pageTitles[pathname] || 'Admin';

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2 pl-4 border-l">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium text-foreground">
            {userInfo?.name || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
}
