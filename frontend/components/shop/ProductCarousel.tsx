'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard, { ProductCardData } from './ProductCard';

interface ProductCarouselProps {
  title: string;
  products: ProductCardData[];
}

export default function ProductCarousel({ title, products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [products, updateScrollState]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    // Cuộn 2 card mỗi lần
    const cardWidth = el.clientWidth / 4;
    el.scrollBy({
      left: direction === 'left' ? -cardWidth * 2 : cardWidth * 2,
      behavior: 'smooth',
    });
  };

  return (
    <div>
      {/* Header với title + nav buttons */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
          <div className="w-20 h-1 bg-primary rounded-full mt-2" />
        </div>

        {/* Nav buttons — chỉ hiện khi có overflow */}
        {(canScrollLeft || canScrollRight) && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-muted-foreground disabled:hover:border-border"
              aria-label="Sản phẩm trước"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-muted-foreground disabled:hover:border-border"
              aria-label="Sản phẩm tiếp theo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Track scroll ngang */}
      <div
        ref={scrollRef}
        className="carousel-scroll flex gap-4 overflow-x-auto pb-2 scroll-smooth"
      >
        <style jsx>{`
          .carousel-scroll {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .carousel-scroll::-webkit-scrollbar {
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

        {/* Spacer cuối */}
        <div className="flex-shrink-0 w-1" aria-hidden />
      </div>
    </div>
  );
}
