'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { User, Search, Menu, X, LogOut, LayoutDashboard, Heart, Phone } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSettingsStore } from '@/store/settingsStore';
import api from '@/lib/api';

export default function ShopHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const userInfo = useUserStore((state) => state.userInfo);
  const logout = useUserStore((state) => state.logout);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { contactButtons, fetchSettings } = useSettingsStore();

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const phone = contactButtons?.phone;
  const zalo = contactButtons?.zalo;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/san-pham?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { href: '/', label: 'Trang chủ' },
    { href: '/san-pham', label: 'Sản phẩm' },
    { href: '/ve-chung-toi', label: 'Về chúng tôi' },
    { href: '/faq', label: 'FAQ' },
    { href: '/blog', label: 'Tin tức' },
    { href: '/lien-he', label: 'Liên hệ' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ===== TOP BAR ===== */}
      <div className="bg-primary text-white text-xs">
        <div className="container mx-auto px-4 flex items-center justify-between h-9">
          <div className="flex items-center gap-4">
            <a href={`tel:${phone?.number || '0123456789'}`} className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
              <Phone className="h-3 w-3" />
              <span>{phone?.label || '0123 456 789'}</span>
            </a>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden sm:inline text-white/80 text-[11px]">Liên hệ đặt hàng qua Zalo & Điện thoại</span>
          </div>
          <div className="flex items-center gap-2">
            {userInfo ? (
              <span className="flex items-center gap-1.5">
                <User className="h-3 w-3" />
                <span className="font-medium">{userInfo.name}</span>
              </span>
            ) : (
              <Link href="/login" className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
                <User className="h-3 w-3" />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ===== MAIN HEADER ===== */}
      <header className={`bg-white sticky top-0 z-50 shadow-sm transition-all duration-300 ${scrolled ? 'py-0' : ''}`}>
        <div className="container mx-auto px-4">
          {/* Row 1: Logo + Search + Icons */}
          <div className={`flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? 'h-14' : 'h-24'}`}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <img src="/logo_anvat.png" alt="KhôVặt" className={`w-auto object-contain transition-all duration-300 ${scrolled ? 'h-10' : 'h-20'}`} />
            </Link>

            {/* Search bar — center */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="flex w-full border border-border rounded-full overflow-hidden hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm sản phẩm yêu thích..."
                  className="flex-1 px-5 py-2.5 text-sm outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden lg:inline">Tìm kiếm</span>
                </button>
              </div>
            </form>

            {/* Right icons */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Zalo */}
              <a
                href={zalo?.id || 'https://zalo.me/0123456789'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-muted-foreground hover:text-blue-600 transition-colors"
              >
                <img src="/logo_zalo.png" alt="Zalo" className="h-6 w-6 object-contain" />
                <span className="text-[10px] mt-0.5 hidden sm:block">Zalo</span>
              </a>

              {/* Phone */}
              <a
                href={`tel:${phone?.number || '0123456789'}`}
                className="flex flex-col items-center text-muted-foreground hover:text-green-600 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span className="text-[10px] mt-0.5 hidden sm:block">Gọi ngay</span>
              </a>

              {/* Wishlist — chỉ hiện trên desktop */}
              <Link href="/yeu-thich" className="relative flex-col items-center text-muted-foreground hover:text-primary transition-colors hidden md:flex">
                <Heart className="h-5 w-5" />
                <span className="text-[10px] mt-0.5 hidden sm:block">Yêu thích</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="text-[10px] mt-0.5 hidden sm:block">
                    {userInfo ? userInfo.name.split(' ').pop() : 'Tài khoản'}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-border rounded-xl shadow-xl z-50 min-w-[180px] py-2">
                    {userInfo ? (
                      <>
                        <div className="px-4 py-2 border-b border-border">
                          <div className="text-sm font-medium text-foreground truncate">{userInfo.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{userInfo.email}</div>
                        </div>
                        <Link href="/tai-khoan" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" /> Tài khoản
                        </Link>
                        {userInfo.isAdmin && (
                          <Link href="/admin/dashboard" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                            <LayoutDashboard className="h-4 w-4 mr-2 text-primary" /> Quản trị Admin
                          </Link>
                        )}
                        <button onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-muted">Đăng nhập</Link>
                        <Link href="/register" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-muted">Đăng ký</Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile toggle */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground ml-1">
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Row 2: Navigation — desktop */}
          <nav className="hidden md:flex items-center gap-1 h-11">
            {/* Nút danh mục sản phẩm */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCatMenuOpen(!catMenuOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  catMenuOpen ? 'bg-primary text-white' : 'text-foreground hover:bg-muted'
                }`}
              >
                <Menu className="h-4 w-4" />
                Danh mục
              </button>
              {catMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCatMenuOpen(false)} />
                  <div className="absolute left-0 top-full mt-1 bg-white border border-border rounded-xl shadow-xl z-50 w-56 py-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/san-pham?category=${cat.slug}`}
                        onClick={() => setCatMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                    {categories.length === 0 && (
                      <div className="px-4 py-3 text-sm text-muted-foreground">Chưa có danh mục</div>
                    )}
                  </div>
                </>
              )}
            </div>

            <span className="text-border mx-1">|</span>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-white py-4 px-4 space-y-2">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex border border-border rounded-full overflow-hidden mb-3">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm sản phẩm..." className="flex-1 px-4 py-2 text-sm outline-none" />
              <button type="submit" className="px-4 py-2 bg-primary text-white">
                <Search className="h-4 w-4" />
              </button>
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-2.5 px-3 rounded-lg text-sm font-medium ${
                  isActive(link.href) ? 'bg-primary text-white' : 'text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/yeu-thich" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted">
              <Heart className={`h-4 w-4 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              Yêu thích {wishlistCount > 0 && <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{wishlistCount}</span>}
            </Link>
            {userInfo ? (
              <>
                {userInfo.isAdmin && (
                  <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)}
                    className="block py-2.5 px-3 rounded-lg text-sm font-medium text-primary hover:bg-primary/5">Quản trị Admin</Link>
                )}
                <button onClick={handleLogout}
                  className="block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">Đăng xuất</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted">Đăng nhập</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted">Đăng ký</Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Overlay for user menu */}
      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}
    </>
  );
}
