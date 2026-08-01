'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X, Phone, Mail, ChevronDown, LogIn, UserCircle } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useSettingsStore } from '@/store/settingsStore';
import { getImageUrl } from '@/lib/utils';

export default function ShopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Navigation');
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const userInfo = useUserStore((state) => state.userInfo);
  const logout = useUserStore((state) => state.logout);
  const { companyInfo, fetchSettings } = useSettingsStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  useEffect(() => {
    setHydrated(true);
    fetchSettings();
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchSettings]);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/about-us', label: t('about') },
    { href: '/services', label: t('services'), hasDropdown: true },
    { href: '/blog', label: t('blog') },
    { href: '/contact-us', label: t('contact') },
  ];

  const servicesLinks = [
    { href: '/services/master-consolidation', label: 'Master Consolidation' },
    { href: '/services/air-freight', label: 'Air Freight' },
    { href: '/services/sea-freight', label: 'Sea Freight' },
    { href: '/services/inland-trucking', label: 'Inland Trucking' },
    { href: '/services/warehousing', label: 'Warehousing' },
    { href: '/services/custom-brokerage', label: 'Custom Brokerage' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-stone-900 text-stone-300 text-xs py-2 hidden md:block border-b border-white/10 relative z-50">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href={`tel:${companyInfo?.phone?.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="h-3 w-3 text-[#ff3f39]" />
              <span>{companyInfo?.phone || '(+84) 28 3620 7585'}</span>
            </a>
            <a href={`mailto:${companyInfo?.email || 'info@spmt.com.vn'}`} className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="h-3 w-3 text-[#ff3f39]" />
              <span>{companyInfo?.email || 'info@spmt.com.vn'}</span>
            </a>
          </div>
          <div className="flex items-center gap-4 font-medium uppercase tracking-wider">
            {hydrated && (
              <>
                {userInfo ? (
                  <div className="relative group cursor-pointer">
                    <div className="flex items-center gap-1.5 text-stone-400 group-hover:text-white transition-colors py-1">
                      <UserCircle className="w-3.5 h-3.5" />
                      <span className="normal-case">{userInfo.name}</span>
                    </div>
                    {/* User Dropdown */}
                    <div className="absolute top-full right-0 mt-0 w-40 bg-white border border-stone-100 shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-50">
                      <div className="py-1">
                        {userInfo.isAdmin && (
                          <Link href="/admin/dashboard" className="block px-4 py-2.5 text-sm normal-case font-medium text-stone-600 hover:text-[#e62c26] hover:bg-stone-50 transition-colors">
                            Dashboard
                          </Link>
                        )}
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2.5 text-sm normal-case font-medium text-stone-600 hover:text-[#e62c26] hover:bg-stone-50 transition-colors border-t border-stone-50"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link href="/login" className="flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors py-1">
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </Link>
                )}
                <div className="w-px h-3 bg-stone-700"></div>
              </>
            )}
            <span 
              onClick={() => switchLocale('en')}
              className={`cursor-pointer transition-colors ${locale === 'en' ? 'text-white' : 'text-stone-500 hover:text-white'}`}
            >EN</span>
            <span 
              onClick={() => switchLocale('vi')}
              className={`cursor-pointer transition-colors ${locale === 'vi' ? 'text-white' : 'text-stone-500 hover:text-white'}`}
            >VI</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`fixed w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-3 top-0' : 'bg-white py-5 top-0 md:top-[33px]'}`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
              <img src={companyInfo?.logo ? getImageUrl(companyInfo.logo) : "/logo.png"} alt="Superman Transport" className="h-8 md:h-10 object-contain" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <div key={link.href} className="relative group">
                  <Link
                    href={link.href}
                    className={`text-sm font-bold uppercase tracking-wide flex items-center gap-1 py-2 transition-colors ${
                      isActive(link.href) ? 'text-[#e62c26]' : 'text-stone-800 hover:text-[#e62c26]'
                    }`}
                  >
                    {link.label}
                    {link.hasDropdown && <ChevronDown className="h-3 w-3" />}
                  </Link>
                  
                  {link.hasDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-stone-100 shadow-2xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                      <div className="py-2">
                        {servicesLinks.map(sub => (
                          <Link key={sub.href} href={sub.href} className="block px-5 py-2.5 text-sm font-medium text-stone-600 hover:text-[#e62c26] hover:bg-stone-50 transition-colors">
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA & Mobile Toggle */}
            <div className="flex items-center gap-4">
              <Link href="/contact-us" className="hidden lg:flex items-center justify-center px-6 py-2.5 bg-[#e62c26] text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-brand-700 hover:shadow-lg hover:shadow-[#ff3f39]/30 transition-all transform hover:-translate-y-0.5">
                {t('requestQuote')}
              </Link>
              
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-stone-800 p-2">
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute w-full bg-white border-t border-stone-100 shadow-xl overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => !link.hasDropdown && setMobileOpen(false)}
                  className={`block text-sm font-bold uppercase tracking-wide py-2 border-b border-stone-50 ${
                    isActive(link.href) ? 'text-[#e62c26]' : 'text-stone-800'
                  }`}
                >
                  {link.label}
                </Link>
                {link.hasDropdown && (
                  <div className="pl-4 mt-2 space-y-2 border-l-2 border-stone-100">
                    {servicesLinks.map(sub => (
                      <Link key={sub.href} href={sub.href} onClick={() => setMobileOpen(false)} className="block py-1.5 text-sm text-stone-600">
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/contact-us" onClick={() => setMobileOpen(false)} className="block text-center px-6 py-3 bg-[#e62c26] text-white text-sm font-bold uppercase tracking-wider rounded-lg mt-4">
              {t('requestQuote')}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
