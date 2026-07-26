'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight, Package, Plane, Anchor, Truck, Building, FileCheck } from 'lucide-react';
import PageBanner from '@/components/shop/PageBanner';
import AnimateOnScroll from '@/components/shop/AnimateOnScroll';

export default function ServicesPage() {
  const t = useTranslations('ServicesPage');
  const tServices = useTranslations('Homepage.Services');
  const locale = useLocale();

  const servicesList = [
    { 
      id: 'master-consolidation', 
      title: tServices('items.0.title'), 
      desc: tServices('items.0.desc'), 
      icon: Package,
      img: '/service1.png' 
    },
    { 
      id: 'air-freight', 
      title: tServices('items.1.title'), 
      desc: tServices('items.1.desc'), 
      icon: Plane,
      img: '/service2.png' 
    },
    { 
      id: 'sea-freight', 
      title: tServices('items.2.title'), 
      desc: tServices('items.2.desc'), 
      icon: Anchor,
      img: '/service3.png' 
    },
    { 
      id: 'inland-trucking', 
      title: tServices('items.3.title'), 
      desc: tServices('items.3.desc'), 
      icon: Truck,
      img: '/service4.png' 
    },
    { 
      id: 'warehousing', 
      title: tServices('items.4.title'), 
      desc: tServices('items.4.desc'), 
      icon: Building,
      img: '/service5.png' 
    },
    { 
      id: 'custom-brokerage', 
      title: tServices('items.5.title'), 
      desc: tServices('items.5.desc'), 
      icon: FileCheck,
      img: '/service6.png' 
    },
  ];

  return (
    <div className="bg-stone-50 min-h-screen font-sans">
      <PageBanner
        title={t('Hero.title')}
        subtitle={t('Hero.subtitle')}
        breadcrumb={t('Hero.breadcrumb')}
      />

      {/* 1. INTRO SECTION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <AnimateOnScroll animation="fade-up">
              <span className="inline-block bg-[#ff3f39] text-white font-bold px-4 py-1.5 text-sm mb-6 transform -skew-x-6 shadow-sm">
                <span className="inline-block transform skew-x-6 uppercase tracking-wider">{t('Intro.tag')}</span>
              </span>
            </AnimateOnScroll>
            
            <AnimateOnScroll animation="fade-up" delay={100}>
              <h2 className="text-4xl md:text-5xl font-black text-stone-900 leading-tight mb-6">
                {t('Intro.title')}
              </h2>
            </AnimateOnScroll>
            
            <AnimateOnScroll animation="fade-up" delay={200}>
              <p className="text-lg text-stone-500 leading-relaxed">
                {t('Intro.desc')}
              </p>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* 2. SERVICES GRID */}
      <section className="py-24 bg-[#fdfaf6] relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent"></div>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {servicesList.map((srv, i) => (
              <AnimateOnScroll key={i} animation="fade-up" delay={(i % 3) * 100}>
                <Link href={`/services/${srv.id}`} className="group block h-full">
                  <div className="bg-white h-full p-8 rounded-3xl border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(255,63,57,0.08)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden flex flex-col">
                    {/* Hover Top Border */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-[#ff3f39] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    
                    {/* Icon & Title */}
                    <div className="flex items-center mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#fff0ef] flex items-center justify-center mr-5 text-[#ff3f39] group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 shadow-sm flex-shrink-0">
                        <srv.icon className="w-7 h-7 stroke-[2]" />
                      </div>
                      <h3 className="text-2xl font-black text-stone-900 group-hover:text-[#ff3f39] transition-colors line-clamp-2">
                        {srv.title}
                      </h3>
                    </div>
                    
                    {/* Image Area */}
                    <div className="w-full flex items-center justify-center mb-6 bg-stone-50 rounded-2xl p-4 overflow-hidden group-hover:bg-[#fff9f9] transition-colors duration-500 min-h-[160px]">
                      <img 
                        src={srv.img} 
                        alt={srv.title} 
                        className="max-h-[140px] w-auto object-contain transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2" 
                      />
                    </div>
                    
                    {/* Description */}
                    <p className="text-stone-500 font-medium leading-relaxed mb-8 flex-grow">
                      {srv.desc}
                    </p>
                    
                    {/* Footer link */}
                    <div className="mt-auto flex items-center text-stone-400 font-bold text-sm uppercase tracking-wider group-hover:text-[#ff3f39] transition-colors">
                      {locale === 'vi' ? 'Tìm Hiểu Thêm' : 'Learn More'}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HIGHLIGHTS / FEATURES */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#ff3f39]/5 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#ff3f39]/5 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block text-[#ff3f39] font-bold text-[13px] tracking-[0.2em] uppercase mb-4">
              {t('Features.tag')}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-stone-900">
              {t('Features.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[0, 1, 2].map((i) => (
              <AnimateOnScroll key={i} animation="fade-up" delay={i * 150}>
                <div className="text-center group">
                  <div className="w-20 h-20 mx-auto rounded-full bg-stone-50 border border-stone-100 shadow-lg flex items-center justify-center text-2xl font-black text-[#ff3f39] mb-6 group-hover:bg-[#ff3f39] group-hover:text-white group-hover:scale-110 transition-all duration-500">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-4">{t(`Features.items.${i}.title`)}</h3>
                  <p className="text-stone-500 font-medium leading-relaxed">
                    {t(`Features.items.${i}.desc`)}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="relative py-24 bg-stone-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8ed7451430?q=80&w=2070&auto=format&fit=crop" 
            alt="Logistics background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/80 to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <AnimateOnScroll animation="fade-up">
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md text-[#ff9b96] font-bold text-xs tracking-[0.2em] uppercase mb-6 border border-white/20">
              {t('Cta.tag')}
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={100}>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              {t('Cta.title')}
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={200}>
            <p className="text-stone-300 text-lg md:text-xl font-light mb-10 leading-relaxed max-w-2xl mx-auto">
              {t('Cta.desc')}
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={300}>
            <Link
              href="/contact-us"
              className="inline-flex items-center px-10 py-5 bg-[#e62c26] text-white rounded-xl font-black uppercase tracking-widest hover:bg-[#ff3f39] hover:scale-105 transition-all shadow-xl shadow-[#7e1d19]/50"
            >
              {t('Cta.button')}
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

    </div>
  );
}
