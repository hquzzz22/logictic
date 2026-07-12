'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import AnimateOnScroll from '@/components/shop/AnimateOnScroll';
import { useTranslations } from 'next-intl';

const exportHCM = [
  { pol: 'HO CHI MINH', country: 'US', pod: 'LOS ANGELES / LONG BEACH', carrier: 'OOCL, ZIM', etd: 'SAT', tt: '23 DAYS' },
  { pol: 'HO CHI MINH', country: 'US', pod: 'NEW YORK', carrier: 'OOCL, ZIM', etd: 'SUN', tt: '30 DAYS' },
  { pol: 'HO CHI MINH', country: 'CHINA', pod: 'SHANGHAI', carrier: 'SITC, KMTC', etd: 'SUN', tt: '7 DAYS' },
  { pol: 'HO CHI MINH', country: 'CHINA', pod: 'QINGDAO', carrier: 'IAL', etd: 'SAT', tt: '8-10 DAYS' },
  { pol: 'HO CHI MINH', country: 'HONGKONG', pod: 'HONGKONG', carrier: 'KMTC', etd: 'WED, MON', tt: '3 DAYS' },
  { pol: 'HO CHI MINH', country: 'TAIWAN', pod: 'KEELUNG', carrier: 'WHL', etd: 'SAT', tt: '4-6 DAYS' },
  { pol: 'HO CHI MINH', country: 'TAIWAN', pod: 'KAOHSIUNG', carrier: 'WHL', etd: 'SAT', tt: '4-6 DAYS' },
  { pol: 'HO CHI MINH', country: 'TAIWAN', pod: 'TAICHUNG', carrier: 'WHL', etd: 'SAT', tt: '4-6 DAYS' },
  { pol: 'HO CHI MINH', country: 'INDIA', pod: 'NHAVA SHEVA', carrier: 'IAL', etd: 'THU', tt: '20 DAYS' },
  { pol: 'HO CHI MINH', country: 'KOREA', pod: 'INCHEON', carrier: 'KMTC', etd: 'TUE', tt: '7 DAYS' },
  { pol: 'HO CHI MINH', country: 'KOREA', pod: 'BUSAN', carrier: 'KMTC', etd: 'SUN, WED', tt: '7 DAYS' },
  { pol: 'HO CHI MINH', country: 'JAPAN', pod: 'TOKYO', carrier: 'SITC', etd: 'THU, SAT', tt: '7 DAYS' },
  { pol: 'HO CHI MINH', country: 'JAPAN', pod: 'OSAKA', carrier: 'SITC', etd: 'THU, SUN', tt: '9 DAYS' },
  { pol: 'HO CHI MINH', country: 'JAPAN', pod: 'KOBE', carrier: 'SITC', etd: 'THU, SUN', tt: '9 DAYS' },
  { pol: 'HO CHI MINH', country: 'THAILAND', pod: 'BANGKOK', carrier: 'KMTC', etd: 'SUN', tt: '3 DAYS' },
  { pol: 'HO CHI MINH', country: 'THAILAND', pod: 'LAEM CHABANG', carrier: 'KMTC', etd: 'SUN', tt: '2 DAYS' },
  { pol: 'HO CHI MINH', country: 'MALAYSIA', pod: 'PORT KLANG', carrier: 'IAL, SITC, WHL', etd: 'TUE', tt: '3 DAYS' },
  { pol: 'HO CHI MINH', country: 'INDONESIA', pod: 'JAKARTA', carrier: 'COSCO, KMTC', etd: 'TUE', tt: '5 DAYS' },
  { pol: 'HO CHI MINH', country: 'SRI LANKA', pod: 'COLOMBO', carrier: 'ONEY', etd: 'SUN', tt: '7 DAYS' },
  { pol: 'HO CHI MINH', country: 'SINGAPORE', pod: 'SINGAPORE', carrier: 'COSCO', etd: 'FRI, MON', tt: '2 DAYS' },
  { pol: 'HO CHI MINH', country: 'AUSTRALIA', pod: 'SYDNEY', carrier: 'OOCL', etd: 'SUN', tt: '18 DAYS' },
  { pol: 'HO CHI MINH', country: 'AUSTRALIA', pod: 'MELBOURNE', carrier: 'OOCL', etd: 'MON', tt: '20 DAYS' },
  { pol: 'HO CHI MINH', country: 'UK', pod: 'SOUTHAMPTON', carrier: 'OOCL', etd: 'SUN', tt: '30-32 DAYS' },
  { pol: 'HO CHI MINH', country: 'UK', pod: 'FELIXSTOWE', carrier: 'OOCL', etd: 'SUN', tt: '30-32 DAYS' },
  { pol: 'HO CHI MINH', country: 'CANADA', pod: 'VANCOUVER', carrier: 'ONEY', etd: 'THU', tt: '35 DAYS' },
  { pol: 'HO CHI MINH', country: 'CANADA', pod: 'TOR/MON', carrier: 'ONEY', etd: 'THU', tt: '35 DAYS' },
  { pol: 'HO CHI MINH', country: 'DUBAI', pod: 'JEBEL ALI', carrier: 'RCL', etd: 'TUE', tt: '17 DAYS' },
  { pol: 'HO CHI MINH', country: 'GERMANY', pod: 'HAMBURG', carrier: 'ONEY', etd: 'THU', tt: '25 DAYS' },
  { pol: 'HO CHI MINH', country: 'NETHERLANDS', pod: 'ROTTERDAM', carrier: 'ONEY', etd: 'WED', tt: '34 DAYS' },
  { pol: 'HO CHI MINH', country: 'BELGIUM', pod: 'ANTWERP', carrier: 'ONEY', etd: 'THU', tt: '25-30 DAYS' },
];

const exportHP = [
  { pol: 'HAI PHONG', country: 'US', pod: 'LOS ANGELES / LONG BEACH', carrier: 'OOCL, ZIM', etd: 'WED', tt: '25 DAYS' },
  { pol: 'HAI PHONG', country: 'US', pod: 'NEW YORK', carrier: 'OOCL, ZIM', etd: 'THU', tt: '30-35 DAYS' },
  { pol: 'HAI PHONG', country: 'CHINA', pod: 'SHANGHAI', carrier: 'SITC, KMTC', etd: 'SAT, SUN', tt: '7 DAYS' },
  { pol: 'HAI PHONG', country: 'HONGKONG', pod: 'HONGKONG', carrier: 'JIS, HAIAN', etd: 'SUN', tt: '2-3 DAYS' },
  { pol: 'HAI PHONG', country: 'SINGAPORE', pod: 'SINGAPORE', carrier: 'YML', etd: 'MON', tt: '5-8 DAYS' },
  { pol: 'HAI PHONG', country: 'THAILAND', pod: 'BANGKOK', carrier: 'KMTC', etd: 'TUE', tt: '7-10 DAYS' },
  { pol: 'HAI PHONG', country: 'THAILAND', pod: 'LAEM CHABANG', carrier: 'SITC', etd: 'WED', tt: '4-5 DAYS' },
  { pol: 'HAI PHONG', country: 'MALAYSIA', pod: 'PORT KLANG', carrier: 'YML', etd: 'MON, TUE', tt: '5-8 DAYS' },
  { pol: 'HAI PHONG', country: 'INDIA', pod: 'CHENNAI', carrier: 'WHL', etd: 'WED, THU', tt: '21-23 DAYS' },
  { pol: 'HAI PHONG', country: 'KOREA', pod: 'INCHEON', carrier: 'KMTC', etd: 'SUN, TUE', tt: '5 DAYS' },
  { pol: 'HAI PHONG', country: 'KOREA', pod: 'BUSAN', carrier: 'KMTC', etd: 'SUN, TUE', tt: '6 DAYS' },
  { pol: 'HAI PHONG', country: 'JAPAN', pod: 'TOKYO', carrier: 'SITC', etd: 'WED, SUN', tt: '8 DAYS' },
  { pol: 'HAI PHONG', country: 'JAPAN', pod: 'OSAKA', carrier: 'SITC', etd: 'FRI, SUN', tt: '6-8 DAYS' },
];

const importLCL = [
  { pol: 'QINGDAO', country: 'VIETNAM', pod: 'HO CHI MINH', carrier: '', etd: 'SUN', tt: '25 DAYS' },
  { pol: 'HONGKONG', country: 'VIETNAM', pod: 'HO CHI MINH', carrier: 'KMTC, SITC, WHL, SINOTRANS', etd: 'TUE / FRI', tt: '30-35 DAYS' },
  { pol: 'SHENZHEN', country: 'VIETNAM', pod: 'HO CHI MINH', carrier: 'KMTC, SITC, WHL, SINOTRANS', etd: 'TUE / FRI', tt: '7 DAYS' },
  { pol: 'SHANGHAI', country: 'VIETNAM', pod: 'HO CHI MINH', carrier: 'SINOTRANS, HEUNG A, OOCL, COSCO, KMTC', etd: 'MON / WED / FRI', tt: '6 DAYS' },
  { pol: 'HONGKONG', country: 'VIETNAM', pod: 'HAI PHONG', carrier: '', etd: 'SAT', tt: '8 DAYS' },
  { pol: 'SHANGHAI', country: 'VIETNAM', pod: 'HAI PHONG', carrier: '', etd: 'WED / FRI', tt: '6-8 DAYS' },
];

export default function MasterConsolidationPage() {
  const pathname = usePathname();
  const t = useTranslations('MasterConsolidation');
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
            src="/banner1.png" 
            alt="Port Terminal" 
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
              const isActive = item.slug === 'master-consolidation';
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
                src="/banner2.png" 
                alt="Container Ship" 
                className="w-full shadow-2xl"
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-left" className="w-full md:w-1/2" delay={200}>
              <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-6">
                {t('Intro.title')}
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed">
                {t('Intro.desc')}
              </p>
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

      {/* 4. TABLES */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl space-y-24">
          
          {/* Table 1 */}
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-3xl font-black text-stone-900 text-center uppercase mb-12">
              {t('Tables.title1')}
            </h2>
            <div className="overflow-x-auto shadow-sm border border-stone-200">
              <table className="w-full min-w-[800px] border-collapse bg-white text-center text-sm">
                <thead>
                  <tr className="bg-[#e62c26] text-white">
                    <th className="py-3 px-4 border border-stone-800 font-bold uppercase tracking-wide">PORT OF LOADING</th>
                    <th className="py-3 px-4 border border-stone-800 font-bold uppercase tracking-wide">COUNTRY</th>
                    <th className="py-3 px-4 border border-stone-800 font-bold uppercase tracking-wide">PORT OF DISCHARGE</th>
                    <th className="py-3 px-4 border border-stone-800 font-bold uppercase tracking-wide">CARRIER</th>
                    <th className="py-3 px-4 border border-stone-800 font-bold uppercase tracking-wide">ETD</th>
                    <th className="py-3 px-4 border border-stone-800 font-bold uppercase tracking-wide">T/T (DAYS)</th>
                  </tr>
                </thead>
                <tbody className="text-stone-800 font-medium">
                  {exportHCM.map((row, i) => (
                    <tr key={i} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 px-4 border border-stone-800 font-bold">{row.pol}</td>
                      <td className="py-3 px-4 border border-stone-800">{row.country}</td>
                      <td className="py-3 px-4 border border-stone-800">{row.pod}</td>
                      <td className="py-3 px-4 border border-stone-800">{row.carrier}</td>
                      <td className="py-3 px-4 border border-stone-800">{row.etd}</td>
                      <td className="py-3 px-4 border border-stone-800">{row.tt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimateOnScroll>

          {/* Table 2 */}
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-3xl font-black text-stone-900 text-center uppercase mb-12">
              {t('Tables.title2')}
            </h2>
            <div className="overflow-x-auto shadow-sm border border-stone-200">
              <table className="w-full min-w-[800px] border-collapse bg-white text-center text-sm">
                <thead>
                  <tr className="bg-[#e62c26] text-white">
                    <th className="py-3 px-4 border border-stone-800 font-bold uppercase tracking-wide">PORT OF LOADING</th>
                    <th className="py-3 px-4 border border-stone-800 font-bold uppercase tracking-wide">COUNTRY</th>
                    <th className="py-3 px-4 border border-stone-800 font-bold uppercase tracking-wide">PORT OF DISCHARGE</th>
                    <th className="py-3 px-4 border border-stone-800 font-bold uppercase tracking-wide">CARRIER</th>
                    <th className="py-3 px-4 border border-stone-800 font-bold uppercase tracking-wide">ETD</th>
                    <th className="py-3 px-4 border border-stone-800 font-bold uppercase tracking-wide">T/T (DAYS)</th>
                  </tr>
                </thead>
                <tbody className="text-stone-800 font-medium">
                  {exportHP.map((row, i) => (
                    <tr key={i} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 px-4 border border-stone-800 font-bold">{row.pol}</td>
                      <td className="py-3 px-4 border border-stone-800">{row.country}</td>
                      <td className="py-3 px-4 border border-stone-800">{row.pod}</td>
                      <td className="py-3 px-4 border border-stone-800">{row.carrier}</td>
                      <td className="py-3 px-4 border border-stone-800">{row.etd}</td>
                      <td className="py-3 px-4 border border-stone-800">{row.tt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimateOnScroll>

          {/* Table 3 */}
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-3xl font-black text-stone-900 text-center uppercase mb-12">
              {t('Tables.title3')}
            </h2>
            <div className="overflow-x-auto shadow-sm border border-stone-200">
              <table className="w-full min-w-[800px] border-collapse bg-white text-center text-sm">
                <thead>
                  <tr className="bg-[#e62c26] text-white">
                    <th className="py-3 px-4 border border-stone-800 font-bold uppercase tracking-wide">PORT OF LOADING</th>
                    <th className="py-3 px-4 border border-stone-800 font-bold uppercase tracking-wide">COUNTRY</th>
                    <th className="py-3 px-4 border border-stone-800 font-bold uppercase tracking-wide">PORT OF DISCHARGE</th>
                    <th className="py-3 px-4 border border-stone-800 font-bold uppercase tracking-wide">CARRIER</th>
                    <th className="py-3 px-4 border border-stone-800 font-bold uppercase tracking-wide">ETD</th>
                    <th className="py-3 px-4 border border-stone-800 font-bold uppercase tracking-wide">T/T (DAYS)</th>
                  </tr>
                </thead>
                <tbody className="text-stone-800 font-medium">
                  {importLCL.map((row, i) => (
                    <tr key={i} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 px-4 border border-stone-800 font-bold">{row.pol}</td>
                      <td className="py-3 px-4 border border-stone-800">{row.country}</td>
                      <td className="py-3 px-4 border border-stone-800">{row.pod}</td>
                      <td className="py-3 px-4 border border-stone-800">{row.carrier}</td>
                      <td className="py-3 px-4 border border-stone-800">{row.etd}</td>
                      <td className="py-3 px-4 border border-stone-800">{row.tt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimateOnScroll>

        </div>
      </section>

      {/* 5. CARDS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end relative">
            
            {/* Left Card */}
            <AnimateOnScroll animation="fade-up" className="bg-white shadow-xl rounded-t-xl overflow-hidden">
              <div className="h-48 overflow-hidden bg-stone-50 flex items-center justify-center">
                <img src="/mc1.png" alt="Map" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-center text-stone-900 mb-6">{t('Cards.left.title')}</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-sm text-stone-500 font-medium items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff3f39] mt-1.5 flex-shrink-0" />
                    {t('Cards.left.items.0')}
                  </li>
                  <li className="flex gap-3 text-sm text-stone-500 font-medium items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff3f39] mt-1.5 flex-shrink-0" />
                    {t('Cards.left.items.1')}
                  </li>
                  <li className="flex gap-3 text-sm text-stone-500 font-medium items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff3f39] mt-1.5 flex-shrink-0" />
                    {t('Cards.left.items.2')}
                  </li>
                  <li className="flex gap-3 text-sm text-stone-500 font-medium items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff3f39] mt-1.5 flex-shrink-0" />
                    {t('Cards.left.items.3')}
                  </li>
                </ul>
              </div>
            </AnimateOnScroll>

            {/* Middle Card (Elevated) */}
            <AnimateOnScroll animation="fade-up" delay={150} className="bg-white shadow-2xl relative z-10 md:-translate-y-8 rounded-t-xl overflow-hidden">
              <div className="h-56 overflow-hidden bg-stone-50 flex items-center justify-center">
                <img src="/mc2.png" alt="Plane and Box" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-center text-stone-900 mb-6">{t('Cards.middle.title')}</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-sm text-stone-500 font-medium items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff3f39] mt-1.5 flex-shrink-0" />
                    {t('Cards.middle.items.0')}
                  </li>
                  <li className="flex gap-3 text-sm text-stone-500 font-medium items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff3f39] mt-1.5 flex-shrink-0" />
                    {t('Cards.middle.items.1')}
                  </li>
                  <li className="flex gap-3 text-sm text-stone-500 font-medium items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff3f39] mt-1.5 flex-shrink-0" />
                    {t('Cards.middle.items.2')}
                  </li>
                  <li className="flex gap-3 text-sm text-stone-500 font-medium items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff3f39] mt-1.5 flex-shrink-0" />
                    {t('Cards.middle.items.3')}
                  </li>
                  <li className="flex gap-3 text-sm text-stone-500 font-medium items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff3f39] mt-1.5 flex-shrink-0" />
                    {t('Cards.middle.items.4')}
                  </li>
                  <li className="flex gap-3 text-sm text-stone-500 font-medium items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff3f39] mt-1.5 flex-shrink-0" />
                    {t('Cards.middle.items.5')}
                  </li>
                </ul>
              </div>
            </AnimateOnScroll>

            {/* Right Card */}
            <AnimateOnScroll animation="fade-up" delay={300} className="bg-white shadow-xl rounded-t-xl overflow-hidden">
              <div className="h-48 overflow-hidden bg-stone-50 flex items-center justify-center">
                <img src="/mc3.png" alt="Container Ship" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-center text-stone-900 mb-6">{t('Cards.right.title')}</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-sm text-stone-500 font-medium items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff3f39] mt-1.5 flex-shrink-0" />
                    {t('Cards.right.items.0')}
                  </li>
                  <li className="flex gap-3 text-sm text-stone-500 font-medium items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff3f39] mt-1.5 flex-shrink-0" />
                    {t('Cards.right.items.1')}
                  </li>
                  <li className="flex gap-3 text-sm text-stone-500 font-medium items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff3f39] mt-1.5 flex-shrink-0" />
                    {t('Cards.right.items.2')}
                  </li>
                  <li className="flex gap-3 text-sm text-stone-500 font-medium items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff3f39] mt-1.5 flex-shrink-0" />
                    {t('Cards.right.items.3')}
                  </li>
                </ul>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* 6. CTA */}
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
