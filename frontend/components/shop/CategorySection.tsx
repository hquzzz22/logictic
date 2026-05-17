'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import ProductCard, { ProductCardData } from './ProductCard';

interface CategorySectionProps {
  id?: string;
  categoryName: string;
  categorySlug: string;
  products: ProductCardData[];
}

export default function CategorySection({ id, categoryName, categorySlug, products }: CategorySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScroll();
    el.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    return () => {
      el.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, [products, updateScroll]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth / 4;
    el.scrollBy({ left: dir === 'left' ? -cardWidth * 2 : cardWidth * 2, behavior: 'smooth' });
  };

  if (products.length === 0) return null;

  return (
    <section id={id} className="bg-white rounded-3xl shadow-sm border border-border overflow-hidden">
      {/* Header — gradient cam nâu của shop */}
      <div className="relative bg-gradient-to-r from-primary via-primary/95 to-amber-700 px-6 py-5 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          {categoryName}
        </h2>

        <div className="flex items-center gap-3">
          {/* Nav arrows — chỉ hiện khi cần scroll */}
          {(canScrollLeft || canScrollRight) && (
            <div className="hidden md:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Sau"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Xem tất cả */}
          <Link
            href={`/san-pham?category=${categorySlug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-white/95 hover:text-white bg-white/15 hover:bg-white/25 backdrop-blur-sm px-3.5 py-1.5 rounded-full transition-all"
          >
            Xem tất cả
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Track scroll */}
      <div
        ref={scrollRef}
        className="cs-scroll flex gap-4 overflow-x-auto p-5 scroll-smooth"
      >
        <style jsx>{`
          .cs-scroll {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .cs-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {products.map((product) => (
          <div
            key={product._id}
            className="flex-shrink-0 w-[78%] sm:w-[42%] md:w-[30%] lg:w-[22%]"
          >
            <ProductCard product={product} />
          </div>
        ))}

        <div className="flex-shrink-0 w-1" aria-hidden />
      </div>
    </section>
  );
}
