'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { ArrowRight, Package, Anchor, Plane, Truck, Building, ShieldCheck, Box, Search, ChevronRight, PlayCircle, Sofa, Shirt, Cpu, Wine, Wrench, ShoppingCart, MapPin, Mail, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AnimateOnScroll from '@/components/shop/AnimateOnScroll';
import TrackingResultModal from '@/components/shop/TrackingResultModal';

export default function Home() {
  const t = useTranslations('Homepage');
  
  const slides = [
    {
      title: t('Hero.slides.0.title'),
      highlight: t('Hero.slides.0.highlight'),
      desc: t('Hero.slides.0.desc'),
      image: '/banner1.png'
    },
    {
      title: t('Hero.slides.1.title'),
      highlight: t('Hero.slides.1.highlight'),
      desc: t('Hero.slides.1.desc'),
      image: '/banner2.png'
    },
    {
      title: t('Hero.slides.2.title'),
      highlight: t('Hero.slides.2.highlight'),
      desc: t('Hero.slides.2.desc'),
      image: '/banner3.png'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  const handleTrack = () => {
    if (!trackingNumber.trim()) {
      alert(t('Tracking.alert'));
      return;
    }
    setIsTrackingModalOpen(true);
  };

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="bg-stone-50 min-h-screen font-sans selection:bg-[#ff3f39] selection:text-white">
      
      {/* 1. HERO SLIDER */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden bg-stone-900">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-stone-900/20 z-10" />
            <img 
              src={slide.image} 
              alt={slide.title} 
              className={`w-full h-full object-cover transform transition-transform duration-[10s] ${index === currentSlide ? 'scale-105' : 'scale-100'}`}
            />
          </div>
        ))}

        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-3xl">
            <AnimateOnScroll animation="fade-up" delay={100}>
              <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#ff6861] font-bold text-xs tracking-[0.2em] uppercase mb-6 shadow-2xl">
                <span className="w-2 h-2 rounded-full bg-[#ff3f39] animate-pulse" />
                {t('Hero.subtitle')}
              </div>
            </AnimateOnScroll>
            
            <AnimateOnScroll animation="fade-up" delay={200}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tighter drop-shadow-2xl">
                {slides[currentSlide].title} <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6861] to-[#e62c26]">
                  {slides[currentSlide].highlight}.
                </span>
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={300}>
              <p className="text-lg md:text-xl text-stone-300 mb-10 max-w-2xl leading-relaxed font-light drop-shadow-md">
                {slides[currentSlide].desc}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={400}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact-us"
                  className="px-8 py-4 bg-[#e62c26] text-white rounded-xl font-black uppercase tracking-widest hover:bg-[#ff3f39] transition-all flex items-center justify-center group shadow-xl shadow-[#7e1d19]/50 hover:shadow-[#e62c26]/40 hover:-translate-y-1"
                >
                  {t('Hero.buttons.getQuote')}
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link
                  href="/about-us"
                  className="px-8 py-4 bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center group"
                >
                  <PlayCircle className="mr-3 h-5 w-5 text-[#ff6861] group-hover:scale-110 transition-transform" />
                  {t('Hero.buttons.ourStory')}
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-32 left-6 md:left-auto md:right-12 z-20 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 transition-all duration-300 rounded-full ${i === currentSlide ? 'w-12 bg-[#ff3f39]' : 'w-4 bg-white/30 hover:bg-white/50'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. TRACKING WIDGET (Overlapping) */}
      <section className="relative z-30 -mt-20">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-2xl p-2 md:p-4 flex flex-col md:flex-row border border-stone-100 max-w-5xl mx-auto backdrop-blur-xl">
            <div className="flex-1 flex items-center px-6 py-4 md:py-2 border-b md:border-b-0 md:border-r border-stone-100">
              <Package className="h-6 w-6 text-[#e62c26] mr-4" />
              <div className="w-full">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1 block">{t('Tracking.title')}</label>
                <input 
                  type="text" 
                  placeholder={t('Tracking.placeholder')}
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full text-stone-900 font-bold bg-transparent outline-none placeholder:text-stone-300 text-lg"
                />
              </div>
            </div>
            <button 
              className="md:w-auto px-8 py-5 md:py-0 bg-stone-900 hover:bg-[#e62c26] text-white font-black uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center m-2 md:m-0"
              onClick={handleTrack}
            >
              <Search className="h-5 w-5 mr-2" />
              {t('Tracking.button')}
            </button>
          </div>
        </div>
        <TrackingResultModal 
          isOpen={isTrackingModalOpen} 
          onClose={() => setIsTrackingModalOpen(false)} 
          trackingNumber={trackingNumber} 
        />
      </section>

      {/* 3. ANIMATED STATS */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center divide-x divide-stone-200">
            {[
              { num: '100+', label: t('Stats.countries') },
              { num: '15k+', label: t('Stats.shipments') },
              { num: '99%', label: t('Stats.delivery') },
              { num: '50+', label: t('Stats.partners') },
            ].map((stat, i) => (
              <AnimateOnScroll key={i} animation="fade-up" delay={i * 100}>
                <div className="px-4">
                  <h3 className="text-4xl md:text-5xl font-black text-stone-900 mb-2 drop-shadow-sm">{stat.num}</h3>
                  <p className="text-sm font-bold text-[#e62c26] uppercase tracking-widest">{stat.label}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* NEW CONSOLIDATION SECTION */}
      <section className="py-24 bg-white text-stone-900 border-t border-stone-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            {/* Left Column */}
            <div className="lg:w-1/2">
              <span className="inline-block bg-[#ff3f39] text-white font-bold px-4 py-1.5 text-sm mb-6 transform -skew-x-6 shadow-sm">
                <span className="inline-block transform skew-x-6">{t('Consolidation.tag')}</span>
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-8">
                {t('Consolidation.title')}
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed mb-10">
                {t('Consolidation.desc')}
              </p>
              <Link
                href="/contact-us"
                className="inline-flex items-center text-[#ff3f39] font-bold hover:text-[#e62c26] transition-colors group text-lg"
              >
                {t('Consolidation.link')}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right Column - Grid */}
            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 mt-8 lg:mt-0">
              
              {/* Item 1 */}
              <AnimateOnScroll animation="fade-up" delay={100}>
                <div>
                  <div className="h-12 w-12 text-[#ff3f39] mb-6">
                    <Package className="w-full h-full stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{t('Consolidation.features.0.title')}</h3>
                  <p className="text-stone-500 leading-relaxed text-sm">
                    {t('Consolidation.features.0.desc')}
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Item 2 */}
              <AnimateOnScroll animation="fade-up" delay={200}>
                <div>
                  <div className="h-12 w-12 text-[#ff3f39] mb-6 flex items-center justify-center">
                    <svg className="w-full h-full stroke-[1.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="15" r="2"/></svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{t('Consolidation.features.1.title')}</h3>
                  <p className="text-stone-500 leading-relaxed text-sm">
                    {t('Consolidation.features.1.desc')}
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Item 3 */}
              <AnimateOnScroll animation="fade-up" delay={300}>
                <div>
                  <div className="h-12 w-12 text-[#ff3f39] mb-6 flex items-center justify-center">
                    <svg className="w-full h-full stroke-[1.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{t('Consolidation.features.2.title')}</h3>
                  <p className="text-stone-500 leading-relaxed text-sm">
                    {t('Consolidation.features.2.desc')}
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Item 4 */}
              <AnimateOnScroll animation="fade-up" delay={400}>
                <div>
                  <div className="h-12 w-12 text-[#ff3f39] mb-6">
                    <Plane className="w-full h-full stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{t('Consolidation.features.3.title')}</h3>
                  <p className="text-stone-500 leading-relaxed text-sm">
                    {t('Consolidation.features.3.desc')}
                  </p>
                </div>
              </AnimateOnScroll>

            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR SERVICES GRID (REDESIGN) */}
      <section className="py-24 bg-[#fdfaf6]">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16">
            <span className="inline-block bg-[#ff3f39] text-white font-bold px-4 py-1.5 text-sm mb-6 transform -skew-x-6 shadow-sm">
              <span className="inline-block transform skew-x-6 uppercase tracking-wider">{t('Services.tag')}</span>
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 leading-tight tracking-tight max-w-4xl mx-auto">
              {t('Services.title').slice(0, -1)}<span className="text-[#ff3f39]">.</span>
            </h2>
          </div>
          
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-10 md:gap-y-12">
            {[
              { id: 'master-consolidation', title: t('Services.items.0.title'), desc: t('Services.items.0.desc'), img: '/service1.png' },
              { id: 'air-freight', title: t('Services.items.1.title'), desc: t('Services.items.1.desc'), img: '/service2.png' },
              { id: 'sea-freight', title: t('Services.items.2.title'), desc: t('Services.items.2.desc'), img: '/service3.png' },
              { id: 'inland-trucking', title: t('Services.items.3.title'), desc: t('Services.items.3.desc'), img: '/service4.png' },
              { id: 'warehousing', title: t('Services.items.4.title'), desc: t('Services.items.4.desc'), img: '/service5.png' },
              { id: 'custom-brokerage', title: t('Services.items.5.title'), desc: t('Services.items.5.desc'), img: '/service6.png' },
            ].map((srv, i) => (
              <AnimateOnScroll key={i} animation="fade-up" delay={i * 100}>
                <Link href={`/services/${srv.id}`} className="group block relative h-[420px] w-full">
                  
                  {/* Striped Background Hover Effect */}
                  <div className="absolute top-3 left-3 -right-4 -bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 pointer-events-none" style={{
                    background: 'repeating-linear-gradient(45deg, rgba(255,63,57,0.8), rgba(255,63,57,0.8) 2px, transparent 2px, transparent 6px)'
                  }} />
                  
                  {/* Card Content */}
                  <div className="relative z-10 bg-white h-full p-8 lg:p-10 flex flex-col items-center text-center transition-all duration-300 border-[4px] border-transparent group-hover:border-[#ff3f39] group-hover:-translate-y-2 group-hover:-translate-x-2 shadow-[0_10px_40px_rgba(0,0,0,0.05)] group-hover:shadow-none">
                    
                    <div className="flex-1 w-full flex items-center justify-center mb-6">
                      <img 
                        src={srv.img} 
                        alt={srv.title} 
                        className="max-h-[140px] w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2" 
                      />
                    </div>
                    
                    <h3 className="text-2xl font-black text-stone-800 mb-4 group-hover:text-stone-900 transition-colors">{srv.title}</h3>
                    <p className="text-stone-500 font-medium leading-relaxed text-[15px]">
                      {srv.desc}
                    </p>
                  </div>
                  
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
          
        </div>
      </section>

      {/* 4.5. CALL TO ACTION BANNER */}
      <section className="relative py-20 bg-stone-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop" 
            alt="Truck on road" 
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay similar to the image */}
          <div className="absolute inset-0 bg-[#1e2335]/90" />
        </div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left md:w-2/3">
              <h2 className="text-3xl md:text-[42px] font-bold text-white mb-4 tracking-tight">
                {t('CtaBanner.title')}
              </h2>
              <p className="text-stone-300 text-[15px] font-medium max-w-2xl">
                {t('CtaBanner.desc')}
              </p>
            </div>
            
            <div className="md:w-1/3 flex justify-start md:justify-end">
              <Link
                href="/contact-us"
                className="inline-block bg-[#ff3f39] text-white font-medium text-sm py-4 px-8 hover:bg-[#e62c26] transition-colors shadow-lg"
              >
                {t('CtaBanner.button')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4.75. INDUSTRIES */}
      <section className="py-24 bg-white border-t border-stone-100">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-20">
            <span className="inline-block bg-[#ff3f39] text-white font-bold px-5 py-2 text-sm mb-6 transform -skew-x-6 shadow-sm">
              <span className="inline-block transform skew-x-6 uppercase tracking-widest">{t('Industries.tag')}</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight">
              {t('Industries.title').slice(0, -1)}<span className="text-[#ff3f39]">.</span>
            </h2>
          </div>
          
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-10">
            
            {[
              { icon: Sofa, title: t('Industries.items.0.title'), desc: t('Industries.items.0.desc') },
              { icon: Shirt, title: t('Industries.items.1.title'), desc: t('Industries.items.1.desc') },
              { icon: Cpu, title: t('Industries.items.2.title'), desc: t('Industries.items.2.desc') },
              { icon: Wine, title: t('Industries.items.3.title'), desc: t('Industries.items.3.desc') },
              { icon: Wrench, title: t('Industries.items.4.title'), desc: t('Industries.items.4.desc') },
              { icon: ShoppingCart, title: t('Industries.items.5.title'), desc: t('Industries.items.5.desc') },
            ].map((ind, i) => (
              <AnimateOnScroll key={i} animation="fade-up" delay={(i % 3 + 1) * 100}>
                <div className="flex flex-col text-left group bg-white border border-stone-100 p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-[#ff3f39]/10 hover:border-[#ff3f39]/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden h-full">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-[#ff3f39] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <div className="text-[#ff3f39] mb-8 bg-[#fff0ef] w-16 h-16 rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 shadow-sm border border-[#ff3f39]/10">
                    <ind.icon className="w-8 h-8 stroke-[2]" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-4 group-hover:text-[#ff3f39] transition-colors">{ind.title}</h3>
                  <p className="text-stone-500 font-medium leading-relaxed text-[15px]">
                    {ind.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}

          </div>
        </div>
      </section>

      {/* 4.8. BENEFITS FOR YOUR BUSINESS */}
      <section className="py-24 bg-[#fdfaf6]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Left side: Image */}
            <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
              <AnimateOnScroll animation="fade-right">
                <img 
                  src="/Benefits.png" 
                  alt="Benefits for Your Business" 
                  className="w-full max-w-[550px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                />
              </AnimateOnScroll>
            </div>
            
            {/* Right side: Content */}
            <div className="lg:w-1/2 w-full">
              <AnimateOnScroll animation="fade-left">
                <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-10 tracking-tight">
                  {t('Benefits.title').slice(0, -1)}<span className="text-[#ff3f39]">.</span>
                </h2>
                
                <ul className="space-y-6">
                  {[
                    { title: t('Benefits.items.0.title'), text: t('Benefits.items.0.desc') },
                    { title: t('Benefits.items.1.title'), text: t('Benefits.items.1.desc') },
                    { title: t('Benefits.items.2.title'), text: t('Benefits.items.2.desc') },
                    { title: t('Benefits.items.3.title'), text: t('Benefits.items.3.desc') },
                    { title: t('Benefits.items.4.title'), text: t('Benefits.items.4.desc') },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start group cursor-default">
                      <span className="mt-2.5 mr-5 h-2.5 w-2.5 rounded-full bg-[#ff3f39] flex-shrink-0 group-hover:scale-150 transition-transform duration-300 shadow-[0_0_10px_rgba(255,63,57,0.5)]"></span>
                      <p className="text-[17px] text-stone-500 font-medium leading-relaxed">
                        <strong className="text-stone-800 group-hover:text-[#ff3f39] transition-colors">{item.title}:</strong> {item.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </AnimateOnScroll>
            </div>
            
          </div>
        </div>
      </section>


      {/* 5. WHY CHOOSE US (INTERACTIVE TABS) */}
      <section className="py-24 bg-stone-900 text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/2">
              <span className="inline-flex items-center gap-2 text-[#ff3f39] font-bold uppercase tracking-widest text-sm mb-4">
                <span className="w-8 h-0.5 bg-[#ff3f39]"></span>
                {t('Advantage.tag')}
              </span>
              <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-10" dangerouslySetInnerHTML={{ __html: t('Advantage.title').replace(' <br/> ', ' <br/> ') }}>
              </h2>
              
              <div className="space-y-2">
                {[
                  { id: 0, title: t('Advantage.tabs.0.title'), desc: t('Advantage.tabs.0.desc') },
                  { id: 1, title: t('Advantage.tabs.1.title'), desc: t('Advantage.tabs.1.desc') },
                  { id: 2, title: t('Advantage.tabs.2.title'), desc: t('Advantage.tabs.2.desc') },
                  { id: 3, title: t('Advantage.tabs.3.title'), desc: t('Advantage.tabs.3.desc') },
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-6 rounded-2xl transition-all duration-300 ${activeTab === tab.id ? 'bg-[#e62c26] shadow-xl shadow-[#7e1d19]/50' : 'hover:bg-stone-800'}`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className={`text-xl font-bold ${activeTab === tab.id ? 'text-white' : 'text-stone-300'}`}>
                        {tab.title}
                      </h3>
                      {activeTab === tab.id && <ChevronRight className="h-6 w-6 text-white animate-pulse" />}
                    </div>
                    {activeTab === tab.id && (
                      <p className="mt-4 text-[#ffe4e2] leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                        {tab.desc}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 relative min-h-[500px]">
              <div className="absolute inset-0 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl">
                <img 
                  src={
                    activeTab === 0 ? "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=800&auto=format&fit=crop" :
                    activeTab === 1 ? "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=800&auto=format&fit=crop" :
                    activeTab === 2 ? "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop" :
                    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop"
                  } 
                  alt="Feature illustration" 
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out"
                  key={activeTab} // Force re-render for smooth fade
                  style={{ animation: 'fade-in 1s ease-out' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent" />
                
                <div className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#ff3f39] flex items-center justify-center">
                      <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#ff9b96] uppercase tracking-widest">{t('Advantage.qualityTitle')}</p>
                      <p className="text-white font-medium">{t('Advantage.qualityDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 7. CONTACT ENQUIRY */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            
            {/* Left Column: Form Card */}
            <div className="lg:w-1/2 w-full">
              <AnimateOnScroll animation="fade-right">
                <div className="bg-white p-10 md:p-14 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-stone-100">
                  <h3 className="text-3xl font-bold text-stone-900 mb-10 text-center">{t('Contact.formTitle')}</h3>
                  
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input 
                        type="text" 
                        placeholder={t('Contact.name')}
                        className="w-full bg-stone-50 border border-transparent focus:border-[#ff3f39] focus:bg-white focus:ring-2 focus:ring-[#ff3f39]/20 rounded-md px-6 py-4 text-stone-700 outline-none transition-all duration-300"
                      />
                      <input 
                        type="text" 
                        placeholder={t('Contact.phone')}
                        className="w-full bg-stone-50 border border-transparent focus:border-[#ff3f39] focus:bg-white focus:ring-2 focus:ring-[#ff3f39]/20 rounded-md px-6 py-4 text-stone-700 outline-none transition-all duration-300"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input 
                        type="email" 
                        placeholder={t('Contact.email')}
                        className="w-full bg-stone-50 border border-transparent focus:border-[#ff3f39] focus:bg-white focus:ring-2 focus:ring-[#ff3f39]/20 rounded-md px-6 py-4 text-stone-700 outline-none transition-all duration-300"
                      />
                      <input 
                        type="text" 
                        placeholder={t('Contact.city')}
                        className="w-full bg-stone-50 border border-transparent focus:border-[#ff3f39] focus:bg-white focus:ring-2 focus:ring-[#ff3f39]/20 rounded-md px-6 py-4 text-stone-700 outline-none transition-all duration-300"
                      />
                    </div>
                    <div>
                      <textarea 
                        placeholder={t('Contact.message')}
                        rows={5}
                        className="w-full bg-stone-50 border border-transparent focus:border-[#ff3f39] focus:bg-white focus:ring-2 focus:ring-[#ff3f39]/20 rounded-md px-6 py-4 text-stone-700 outline-none transition-all duration-300 resize-none"
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      className="w-full bg-[#ff3f39] hover:bg-[#e62c26] text-white font-medium py-4 rounded-md transition-colors"
                    >
                      {t('Contact.submit')}
                    </button>
                  </form>
                </div>
              </AnimateOnScroll>
            </div>
            
            {/* Right Column: Info */}
            <div className="lg:w-1/2 w-full">
              <AnimateOnScroll animation="fade-left">
                <span className="inline-block text-stone-900 font-bold text-[13px] tracking-[0.1em] uppercase mb-5">
                  {t('Contact.tag')}
                </span>
                <h2 className="text-4xl md:text-[44px] font-black text-stone-900 mb-8 tracking-tight leading-[1.15]">
                  {t('Contact.title').slice(0, -1)}<span className="text-[#ff3f39]">.</span>
                </h2>
                <p className="text-stone-600 font-medium leading-relaxed mb-12 max-w-lg">
                  {t('Contact.desc')}
                </p>
                
                {/* Contact Detail Block */}
                <div>
                  <h3 className="text-2xl font-medium text-stone-900 mb-6">{t('Contact.office')}</h3>
                  <div className="space-y-5">
                    <div className="flex items-start group cursor-default">
                      <div className="mt-1 w-8 h-8 rounded-full bg-[#ff3f39] flex items-center justify-center flex-shrink-0 mr-4 transition-transform group-hover:scale-110 shadow-sm shadow-[#ff3f39]/40">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-stone-500 font-medium text-sm leading-relaxed max-w-sm">
                        {t('Contact.address')}
                      </p>
                    </div>
                    <div className="flex items-center group cursor-default">
                      <div className="w-8 h-8 rounded-full bg-[#ff3f39] flex items-center justify-center flex-shrink-0 mr-4 transition-transform group-hover:scale-110 shadow-sm shadow-[#ff3f39]/40">
                        <Mail className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-stone-500 font-medium text-sm leading-relaxed">
                        info@spmt.com.vn
                      </p>
                    </div>
                    <div className="flex items-center group cursor-default">
                      <div className="w-8 h-8 rounded-full bg-[#ff3f39] flex items-center justify-center flex-shrink-0 mr-4 transition-transform group-hover:scale-110 shadow-sm shadow-[#ff3f39]/40">
                        <Phone className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-stone-500 font-medium text-sm leading-relaxed">
                        (+84) 28 36207585/587
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
            
          </div>
        </div>
      </section>

      {/* 8. PREMIUM CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#e62c26]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
          {/* Optimized Gradient Orbs (No heavy mix-blend or complex blur transforms) */}
          <div className="absolute -top-20 -left-20 w-[30rem] h-[30rem] bg-[#ff6861]/30 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -right-20 w-[30rem] h-[30rem] bg-brand-800/40 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-xs tracking-[0.2em] uppercase mb-6 border border-white/30">
            {t('PremiumCta.tag')}
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 max-w-4xl mx-auto leading-tight tracking-tighter drop-shadow-lg">
            {t('PremiumCta.title')}
          </h2>
          <p className="text-[#ffe4e2] max-w-2xl mx-auto mb-12 text-xl font-light">
            {t('PremiumCta.desc')}
          </p>
          <Link
            href="/contact-us"
            className="inline-flex items-center px-12 py-5 bg-white text-[#e62c26] rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl shadow-[#7e1d19]/50"
          >
            {t('PremiumCta.button')}
            <ArrowRight className="ml-3 h-5 w-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
