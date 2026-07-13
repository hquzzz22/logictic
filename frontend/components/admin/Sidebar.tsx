'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  FileText,
  Users,
  LogOut,
  ExternalLink,
  Settings,
  Mail,
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';

const sidebarItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Vận đơn', href: '/admin/shipments', icon: Package },
  { name: 'Bài viết', href: '/admin/posts', icon: FileText },
  { name: 'DM Bài viết', href: '/admin/post-categories', icon: Tags },
  { name: 'Người dùng', href: '/admin/users', icon: Users },
  { name: 'Tin nhắn', href: '/admin/contacts', icon: Mail },
  { name: 'Cài đặt', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useUserStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-30">
      <div className="h-16 flex items-center justify-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <img src="/logo.png" alt="Superman Transport" className="h-8 object-contain" />
          <span className="block text-xs font-normal text-muted-foreground ml-2 bg-stone-100 px-2 py-0.5 rounded-full">Admin</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {sidebarItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:bg-muted transition-colors"
        >
          <ExternalLink className="mr-3 h-5 w-5" />
          Xem trang web
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
