'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import AnimateOnScroll from '@/components/shop/AnimateOnScroll';
import { useTranslations } from 'next-intl';

export default function SeaFreightPage() {
  const pathname = usePathname();
  const t = useTranslations('SeaFreight');
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const subNavItems = [
    { name: t('SubNav.masterConsolidation'), slug: 'master-consolidation' },
    { name: t('SubNav.airFreight'), slug: 'air-freight' },
    { name: t('SubNav.seaFreight'), slug: 'sea-freight' },
    { name: t('SubNav.inlandTrucking'), slug: 'inland-trucking' },
    { name: t('SubNav.warehousing'), slug: 'warehousing' },
    { name: t('SubNav.customBrokerage'), slug: 'custom-brokerage' },
  ];

  const accordionData = [
    { title: t('Accordion.items.0.title'), content: t('Accordion.items.0.desc') },
    { title: t('Accordion.items.1.title'), content: t('Accordion.items.1.desc') },
    { title: t('Accordion.items.2.title'), content: t('Accordion.items.2.desc') },
    { title: t('Accordion.items.3.title'), content: t('Accordion.items.3.desc') },
    { title: t('Accordion.items.4.title'), content: t('Accordion.items.4.desc') }
  ];

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-[#ff3f39] selection:text-white pb-0">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="/sf_banner.png" 
            alt="Sea Freight Hero" 
            className="w-full h-full object-cover opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-stone-900/40" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center flex flex-col h-full justify-center">
          <div className="flex-1 flex items-center justify-center">
            <AnimateOnScroll animation="fade-up">
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                {t('Hero.title')}
              </h1>
            </AnimateOnScroll>
          </div>
          
          {/* Sub Navigation */}
          <div className="w-full pb-8 flex flex-wrap justify-center gap-6 md:gap-10 text-sm md:text-base font-bold text-white/70">
            {subNavItems.map((item) => {
              const isActive = item.slug === 'sea-freight';
              return (
                <Link 
                  key={item.slug} 
                  href={`/services/${item.slug}`}
                  className={`relative pb-2 hover:text-white transition-colors ${isActive ? 'text-white' : ''}`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ff3f39]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. INTRODUCTION */}
      <section className="py-24 bg-white relative z-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <AnimateOnScroll animation="fade-right" className="w-full md:w-1/2">
              <img 
                src="/sff.png" 
                alt="Sea Freight Intro" 
                className="w-full shadow-2xl object-cover aspect-video"
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-left" className="w-full md:w-1/2" delay={200}>
              <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-6">
                {t('Intro.title')}
              </h2>
              <div 
                className="text-stone-500 text-lg leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: t.raw('Intro.desc') }} 
              />
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* 3. ACCORDION (WHY) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <AnimateOnScroll animation="fade-up">
            <span className="inline-block bg-[#ff3f39] text-white font-bold px-6 py-2 text-sm mb-6 shadow-sm">
              {t('Accordion.tag')}
            </span>
            <h2 className="text-4xl font-black text-stone-900 mb-16">
              {t('Accordion.title')}
            </h2>
          </AnimateOnScroll>

          <div className="space-y-4 text-left">
            {accordionData.map((item, idx) => (
              <AnimateOnScroll key={idx} animation="fade-up" delay={idx * 100}>
                <div 
                  className={`bg-[#f5f6f8] overflow-hidden transition-all duration-300 ${openAccordion === idx ? 'pb-6' : ''}`}
                >
                  <button 
                    onClick={() => toggleAccordion(idx)}
                    className="w-full px-8 py-6 flex items-center justify-between focus:outline-none"
                  >
                    <span className="text-lg font-bold text-[#343e5c]">
                      {item.title}
                    </span>
                    {openAccordion === idx ? (
                      <ChevronUp className="w-5 h-5 text-[#ff3f39]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </button>
                  <div 
                    className={`px-8 text-[#747e9a] font-medium leading-relaxed transition-all duration-300 ease-in-out ${
                      openAccordion === idx ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'
                    }`}
                  >
                    {item.content}
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CARDS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end relative">
            
            {/* Left Card */}
            <AnimateOnScroll animation="fade-up" className="bg-white shadow-xl rounded-t-xl overflow-hidden">
              <div className="h-48 overflow-hidden bg-stone-50 flex items-center justify-center">
                <img src="/sf1.png" alt="Left Card Image" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-center text-stone-900 mb-6">{t('Cards.left.title')}</h3>
                <ul className="space-y-4">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <li key={i} className="flex gap-3 text-sm text-stone-500 font-medium items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff3f39] mt-1.5 flex-shrink-0" />
                      {t(`Cards.left.items.${i}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateOnScroll>

            {/* Middle Card (Elevated) */}
            <AnimateOnScroll animation="fade-up" delay={150} className="bg-white shadow-2xl relative z-10 md:-translate-y-8 rounded-t-xl overflow-hidden">
              <div className="h-56 overflow-hidden bg-stone-50 flex items-center justify-center">
                <img src="/sf2.png" alt="Middle Card Image" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-center text-stone-900 mb-6">{t('Cards.middle.title')}</h3>
                <ul className="space-y-4">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <li key={i} className="flex gap-3 text-sm text-stone-500 font-medium items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff3f39] mt-1.5 flex-shrink-0" />
                      {t(`Cards.middle.items.${i}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateOnScroll>

            {/* Right Card */}
            <AnimateOnScroll animation="fade-up" delay={300} className="bg-white shadow-xl rounded-t-xl overflow-hidden">
              <div className="h-48 overflow-hidden bg-stone-50 flex items-center justify-center">
                <img src="/sf3.png" alt="Right Card Image" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-center text-stone-900 mb-6">{t('Cards.right.title')}</h3>
                <ul className="space-y-4">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <li key={i} className="flex gap-3 text-sm text-stone-500 font-medium items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff3f39] mt-1.5 flex-shrink-0" />
                      {t(`Cards.right.items.${i}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-24 bg-white text-center mb-12">
        <div className="container mx-auto px-6 max-w-3xl">
          <AnimateOnScroll animation="fade-up">
            <span className="inline-block bg-[#ff3f39] text-white font-bold px-4 py-1.5 text-xs mb-6 uppercase tracking-widest shadow-sm">
              {t('Cta.tag')}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-6 tracking-tight">
              {t('Cta.title')}
            </h2>
            <p className="text-stone-500 text-lg font-medium leading-relaxed mb-10">
              {t('Cta.desc')}
            </p>
            <Link 
              href="/contact-us"
              className="inline-block px-10 py-4 bg-[#ff3f39] text-white font-black text-sm uppercase tracking-widest rounded shadow-[#ff3f39]/30 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all"
            >
              {t('Cta.button')}
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

    </div>
  );
}
