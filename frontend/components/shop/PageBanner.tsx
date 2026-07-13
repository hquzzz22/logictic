'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  tags?: { label: string; emoji?: string }[];
}

export default function PageBanner({ title, subtitle, breadcrumb, tags }: PageBannerProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-stone-900">
      {/* Decorative circles */}
      <div className="absolute top-[-80px] left-[-80px] w-[250px] h-[250px] rounded-full border-[30px] border-white/10 pointer-events-none" />
      <div className="absolute top-[-40px] right-[-60px] w-[200px] h-[200px] rounded-full border-[25px] border-white/10 pointer-events-none" />
      <div className="absolute bottom-[20px] left-[15%] w-[100px] h-[100px] rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute top-[30px] right-[20%] w-[60px] h-[60px] rounded-full bg-white/5 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-20 text-center">
        {/* Breadcrumb link */}
        {breadcrumb && (
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-bold uppercase tracking-wider rounded-full hover:bg-white/25 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {breadcrumb}
          </Link>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 banner-title-glow">
          {title.split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-[#ffe4e2] max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-6 font-light">
            {subtitle}
          </p>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-white/20 transition-colors cursor-default shadow-lg"
              >
                {tag.emoji && <span>{tag.emoji}</span>}
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[60px] md:h-[80px] lg:h-[100px]"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120V90C120 100 240 105 360 95C540 80 720 50 900 45C1080 40 1260 60 1380 75L1440 80V120H0Z"
            className="fill-white/10"
          />
          <path
            d="M0 120V100C180 65 360 45 540 50C720 55 900 80 1080 85C1200 88 1320 78 1440 70V120H0Z"
            fill="#fdfaf6"
          />
        </svg>
      </div>
    </section>
  );
}
