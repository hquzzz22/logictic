'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface CategoryTabsProps {
  categories: Category[];
}

export default function CategoryTabs({ categories }: CategoryTabsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(140);
  const isClickScrolling = useRef(false);
  const hasInteracted = useRef(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll tab active vào giữa container — CHỈ scroll ngang trong container,
  // KHÔNG dùng scrollIntoView (vì nó kéo cả page dọc).
  // Chỉ chạy khi user đã tương tác (click tab hoặc đã scroll trang) để tránh kéo trang khi mới load.
  useEffect(() => {
    if (!activeId || !tabsContainerRef.current || !hasInteracted.current) return;
    const container = tabsContainerRef.current;
    const activeBtn = container.querySelector(`[data-cat-id="${activeId}"]`) as HTMLElement | null;
    if (!activeBtn) return;
    const containerRect = container.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const offset = btnRect.left - containerRect.left - containerRect.width / 2 + btnRect.width / 2;
    container.scrollBy({ left: offset, behavior: 'smooth' });
  }, [activeId]);

  // Scroll spy — theo dõi section nào đang trong viewport
  useEffect(() => {
    const handleScroll = () => {
      if (!hasInteracted.current) hasInteracted.current = true;
      if (isClickScrolling.current) return;

      const sections = categories
        .map((cat) => {
          const el = document.getElementById(`cat-${cat.slug}`);
          if (!el) return null;
          return { id: cat._id, top: el.getBoundingClientRect().top };
        })
        .filter(Boolean) as { id: string; top: number }[];

      const active = sections.filter((s) => s.top < 250).sort((a, b) => b.top - a.top)[0];
      if (active) setActiveId(active.id);
      else if (sections.length > 0) setActiveId(sections[0].id);
    };

    // KHÔNG gọi handleScroll ngay khi mount để tránh setActiveId → trigger scrollIntoView lần đầu
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Đo chiều cao header thật để sticky tabs khít
  useEffect(() => {
    const measure = () => {
      const header = document.querySelector('header');
      if (header) setHeaderHeight(header.offsetHeight);
    };
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const scrollToCategory = (slug: string, id: string) => {
    hasInteracted.current = true;
    isClickScrolling.current = true;
    setActiveId(id);
    setMenuOpen(false);
    const el = document.getElementById(`cat-${slug}`);
    if (el) {
      const offset = 180;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setTimeout(() => { isClickScrolling.current = false; }, 800);
  };

  if (categories.length === 0) return null;

  return (
    <div
      className="sticky z-30 bg-background/95 backdrop-blur-sm py-3 mb-6 border-b border-border/50"
      style={{ top: `${headerHeight}px` }}
    >
      <div className="flex items-center gap-3">
        {/* Menu button + dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              menuOpen
                ? 'bg-primary text-white shadow-md'
                : 'bg-primary text-white shadow-sm hover:shadow-md'
            }`}
            aria-label="Danh mục"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Dropdown danh mục */}
          {menuOpen && (
            <div className="absolute left-0 top-full mt-2 bg-white border border-border rounded-2xl shadow-2xl w-64 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {categories.map((cat) => {
                const isActive = activeId === cat._id;
                return (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => scrollToCategory(cat.slug, cat._id)}
                    className={`w-full text-left px-5 py-3 text-[15px] font-medium transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/5'
                        : 'text-foreground hover:bg-muted/60'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <span className="text-border text-xl font-light">|</span>

        {/* Tabs ngang */}
        <div className="flex-1 overflow-x-auto tabs-scroll" ref={tabsContainerRef}>
          <div className="flex items-center gap-1 min-w-max">
            {categories.map((cat) => {
              const isActive = activeId === cat._id;
              return (
                <button
                  key={cat._id}
                  type="button"
                  data-cat-id={cat._id}
                  onClick={() => scrollToCategory(cat.slug, cat._id)}
                  className={`relative px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors rounded-lg ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <style jsx>{`
          .tabs-scroll::-webkit-scrollbar { display: none; }
          .tabs-scroll { scrollbar-width: none; }
        `}</style>
      </div>
    </div>
  );
}
