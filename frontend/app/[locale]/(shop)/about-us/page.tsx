'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Package, Globe, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import AnimateOnScroll from '@/components/shop/AnimateOnScroll';
import AnimatedCounter from '@/components/shop/AnimatedCounter';
import AnimatedProgressBar from '@/components/shop/AnimatedProgressBar';

export default function AboutUs() {
  const t = useTranslations('AboutUs');
  
  const row1Images = [1, 2, 3, 4, 5, 6, 7, 8];
  const row2Images = [9, 10, 11, 12, 13, 14, 15];
  
  // Create arrays with even number of repetitions for seamless -50% translation
  const renderRow1 = [...row1Images, ...row1Images, ...row1Images, ...row1Images];
  const renderRow2 = [...row2Images, ...row2Images, ...row2Images, ...row2Images];

  return (
    <div className="bg-stone-50 min-h-screen font-sans selection:bg-[#ff3f39] selection:text-white pb-0">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" 
            alt="Office" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <AnimateOnScroll animation="fade-up">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              {t('Hero.title')}
            </h1>
            <div className="w-24 h-1.5 bg-[#ff3f39] mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-stone-300 font-light max-w-3xl mx-auto">
              {t('Hero.subtitle')}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* 2. OUR JOURNEY (COMPANY INTRO) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/3 lg:sticky lg:top-32">
              <span className="inline-block bg-[#ff3f39] text-white font-bold px-4 py-1.5 text-sm mb-6 transform -skew-x-6 shadow-sm">
                <span className="inline-block transform skew-x-6 uppercase tracking-wider">{t('Intro.title')}</span>
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-stone-900 leading-tight">
                The Superman Story<span className="text-[#ff3f39]">.</span>
              </h2>
            </div>
            <div className="lg:w-2/3 space-y-6 text-stone-600 text-lg leading-relaxed font-medium">
              <AnimateOnScroll animation="fade-up" delay={100}>
                <p>{t('Intro.paragraphs.0')}</p>
              </AnimateOnScroll>
              <AnimateOnScroll animation="fade-up" delay={200}>
                <p>{t('Intro.paragraphs.1')}</p>
              </AnimateOnScroll>
              <AnimateOnScroll animation="fade-up" delay={300}>
                <p>{t('Intro.paragraphs.2')}</p>
              </AnimateOnScroll>
              <AnimateOnScroll animation="fade-up" delay={400}>
                <p>{t('Intro.paragraphs.3')}</p>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GLOBAL IMPACT (STATS) */}
      <section className="py-20 bg-stone-900 border-t-4 border-[#ff3f39]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { image: '/ab1.png', num: t('Stats.items.0.num'), title: t('Stats.items.0.title'), desc: t('Stats.items.0.desc') },
              { image: '/ab2.png', num: t('Stats.items.1.num'), title: t('Stats.items.1.title'), desc: t('Stats.items.1.desc') },
              { image: '/ab3.png', num: t('Stats.items.2.num'), title: t('Stats.items.2.title'), desc: t('Stats.items.2.desc') },
            ].map((stat, i) => (
              <AnimateOnScroll key={i} animation="fade-up" delay={i * 150}>
                <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                  <div className="h-32 mb-6 group-hover:scale-110 transition-transform flex items-center justify-center">
                    <img src={stat.image} alt={stat.title} className="max-h-full max-w-[200px] object-contain drop-shadow-xl" />
                  </div>
                  <h3 className="text-5xl font-black text-white mb-2">
                    <AnimatedCounter value={stat.num} />
                  </h3>
                  <p className="text-lg font-bold text-[#ff9b96] mb-4">{stat.title}</p>
                  <p className="text-stone-400 text-sm leading-relaxed">{stat.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VISION & MISSION */}
      <section className="py-24 bg-[#fdfaf6] overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Vision */}
          <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
            <div className="lg:w-1/2 w-full">
              <AnimateOnScroll animation="fade-right">
                <span className="text-[#ff3f39] font-black tracking-widest text-lg uppercase mb-4 block">01.</span>
                <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-6">{t('VisionMission.vision.title')}</h2>
                <p className="text-stone-600 text-lg leading-relaxed font-medium">
                  {t('VisionMission.vision.desc')}
                </p>
              </AnimateOnScroll>
            </div>
            <div className="lg:w-1/2 w-full relative">
              <AnimateOnScroll animation="fade-left">
                <div className="absolute inset-0 bg-[#ff3f39] rounded-3xl transform translate-x-4 translate-y-4"></div>
                <img 
                  src="/vision.png" 
                  alt="Vision" 
                  className="relative z-10 w-full h-[400px] object-cover rounded-3xl shadow-2xl"
                />
              </AnimateOnScroll>
            </div>
          </div>

          {/* Mission */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <div className="lg:w-1/2 w-full lg:pl-12">
              <AnimateOnScroll animation="fade-left">
                <span className="text-[#ff3f39] font-black tracking-widest text-lg uppercase mb-4 block">02.</span>
                <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-6">{t('VisionMission.mission.title')}</h2>
                <p className="text-stone-600 text-lg leading-relaxed font-medium">
                  {t('VisionMission.mission.desc')}
                </p>
              </AnimateOnScroll>
            </div>
            <div className="lg:w-1/2 w-full relative">
              <AnimateOnScroll animation="fade-right">
                <div className="absolute inset-0 bg-stone-900 rounded-3xl transform -translate-x-4 translate-y-4"></div>
                <img 
                  src="/MISSION.png" 
                  alt="Mission" 
                  className="relative z-10 w-full h-[400px] object-cover rounded-3xl shadow-2xl"
                />
              </AnimateOnScroll>
            </div>
          </div>

        </div>
      </section>

      {/* 5. CORE VALUES */}
      <section className="py-24 bg-white border-t border-stone-100 overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Core Values Text */}
            <div className="lg:w-1/2 w-full">
              <AnimateOnScroll animation="fade-right">
                <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-10 uppercase tracking-tight">
                  {t('CoreValues.title')}
                </h2>
                <div className="space-y-4">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center group">
                      <span className="text-xl font-bold text-stone-400 mr-4 w-6 text-right">{i + 1}.</span>
                      <span className="text-xl font-medium text-stone-600 group-hover:text-[#ff3f39] transition-colors">
                        {t(`CoreValues.items.${i}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </AnimateOnScroll>
            </div>

            {/* Core Values Image */}
            <div className="lg:w-1/2 w-full relative">
              <AnimateOnScroll animation="fade-left">
                <div className="absolute inset-0 bg-stone-100 rounded-3xl transform translate-x-4 translate-y-4"></div>
                <img 
                  src="/core.png" 
                  alt="Core Values" 
                  className="relative z-10 w-full h-[400px] object-cover rounded-3xl shadow-xl"
                />
              </AnimateOnScroll>
            </div>

          </div>
        </div>
      </section>

      {/* 5.5 PROGRESS BARS */}
      <section className="py-24 bg-[#fdfaf6] border-t border-stone-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 w-full">
              <AnimateOnScroll animation="fade-right">
                <h2 className="text-3xl md:text-4xl font-black text-stone-900 leading-tight">
                  {t('Progress.title')}
                </h2>
              </AnimateOnScroll>
            </div>
            <div className="lg:w-1/2 w-full space-y-10">
              <AnimateOnScroll animation="fade-left">
                <div className="space-y-10">
                  {[0, 1, 2].map((i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-black uppercase tracking-wider text-stone-900">{t(`Progress.items.${i}.label`)}</span>
                        <span className="text-sm font-black text-[#ff3f39]">
                          <AnimatedCounter value={t(`Progress.items.${i}.value`)} />
                        </span>
                      </div>
                      <div className="h-3 w-full bg-stone-200 rounded-full overflow-hidden">
                        <AnimatedProgressBar targetWidth={t(`Progress.items.${i}.value`)} />
                      </div>
                    </div>
                  ))}
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PARTNERS MARQUEE */}
      <section className="py-20 bg-stone-50 overflow-hidden border-t border-stone-200">
        <div className="container mx-auto px-6 max-w-7xl text-center mb-12">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-2xl md:text-3xl font-black text-stone-900 uppercase">{t('Partners.title')}</h2>
          </AnimateOnScroll>
        </div>
        
        {/* Marquee Wrapper */}
        <div className="flex flex-col gap-6 w-full max-w-[100vw] overflow-hidden">
          
          {/* Row 1 - Moves Left */}
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {renderRow1.map((imgNum, index) => (
              <div key={index} className="flex-shrink-0 px-6 mx-3 w-[200px] h-[100px] bg-white rounded-xl shadow-sm border border-stone-100 flex items-center justify-center hover:border-[#ff3f39]/30 hover:shadow-md transition-all">
                <img src={`/oa${imgNum}.png`} alt={`Partner ${imgNum}`} className="max-w-full max-h-[60px] object-contain" />
              </div>
            ))}
          </div>

          {/* Row 2 - Moves Right (Using reverse animation direction) */}
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]" style={{ animationDirection: 'reverse', animationDuration: '35s' }}>
            {renderRow2.map((imgNum, index) => (
              <div key={index} className="flex-shrink-0 px-6 mx-3 w-[200px] h-[100px] bg-white rounded-xl shadow-sm border border-stone-100 flex items-center justify-center hover:border-[#ff3f39]/30 hover:shadow-md transition-all">
                <img src={`/oa${imgNum}.png`} alt={`Partner ${imgNum}`} className="max-w-full max-h-[60px] object-contain" />
              </div>
            ))}
          </div>
          
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-6 max-w-3xl">
          <AnimateOnScroll animation="fade-up">
            <span className="inline-block bg-[#ff3f39] text-white font-bold px-4 py-1.5 text-xs mb-6 uppercase tracking-widest shadow-sm">
              {t('Cta.tag')}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-6 tracking-tight">
              {t('Cta.title').slice(0, -1)}<span className="text-[#ff3f39]">.</span>
            </h2>
            <p className="text-stone-500 text-lg font-medium leading-relaxed mb-10">
              {t('Cta.desc')}
            </p>
            <Link
              href="/contact-us"
              className="inline-block px-10 py-5 bg-[#ff3f39] text-white font-black text-sm uppercase tracking-widest rounded-xl hover:bg-[#e62c26] hover:-translate-y-1 hover:shadow-xl transition-all shadow-[#ff3f39]/30"
            >
              {t('Cta.button')}
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

    </div>
  );
}
