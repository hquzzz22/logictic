'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import AnimateOnScroll from '@/components/shop/AnimateOnScroll';

export default function ContactPage() {
  const t = useTranslations('ContactUs');
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    // Transform form data to match backend schema (subject is required by old backend)
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: `Contact from City: ${form.city}`,
      message: form.message
    };

    api.post('/contacts', payload)
      .then(() => {
        toast.success(t('Form.success'));
        setForm({ name: '', email: '', phone: '', city: '', message: '' });
      })
      .catch(() => toast.error(t('Form.error')))
      .finally(() => setSending(false));
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-[#ff3f39] selection:text-white pb-0">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="/oa1.png" 
            alt="Office" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <AnimateOnScroll animation="fade-up">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter">
              {t('Hero.title')}
            </h1>
          </AnimateOnScroll>
        </div>
      </section>

      {/* 2. MAIN CONTACT SECTION */}
      <section className="py-24 bg-white relative -mt-16 z-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Left Column: Form */}
            <AnimateOnScroll animation="fade-right">
              <div className="bg-stone-50 p-10 md:p-12 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100">
                <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-10">
                  {t('Form.title')}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-5 py-4 bg-white border border-stone-200 rounded-xl text-stone-700 font-medium placeholder-stone-400 focus:outline-none focus:border-[#ff3f39] focus:ring-1 focus:ring-[#ff3f39] transition-all"
                        placeholder={t('Form.name')}
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-5 py-4 bg-white border border-stone-200 rounded-xl text-stone-700 font-medium placeholder-stone-400 focus:outline-none focus:border-[#ff3f39] focus:ring-1 focus:ring-[#ff3f39] transition-all"
                        placeholder={t('Form.phone')}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-5 py-4 bg-white border border-stone-200 rounded-xl text-stone-700 font-medium placeholder-stone-400 focus:outline-none focus:border-[#ff3f39] focus:ring-1 focus:ring-[#ff3f39] transition-all"
                        placeholder={t('Form.email')}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full px-5 py-4 bg-white border border-stone-200 rounded-xl text-stone-700 font-medium placeholder-stone-400 focus:outline-none focus:border-[#ff3f39] focus:ring-1 focus:ring-[#ff3f39] transition-all"
                        placeholder={t('Form.city')}
                      />
                    </div>
                  </div>
                  <div>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-5 py-4 bg-white border border-stone-200 rounded-xl text-stone-700 font-medium placeholder-stone-400 focus:outline-none focus:border-[#ff3f39] focus:ring-1 focus:ring-[#ff3f39] transition-all resize-none"
                      placeholder={t('Form.message')}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full md:w-auto px-10 py-4 bg-[#ff3f39] text-white font-black text-sm uppercase tracking-widest rounded-xl hover:bg-[#e62c26] hover:-translate-y-1 hover:shadow-xl transition-all shadow-[#ff3f39]/30 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {sending ? t('Form.sending') : t('Form.submit')}
                  </button>
                </form>
              </div>
            </AnimateOnScroll>

            {/* Right Column: Info */}
            <AnimateOnScroll animation="fade-left" delay={200}>
              <div className="pt-8">
                <span className="text-stone-900 font-black tracking-widest text-sm uppercase mb-6 block">
                  {t('Info.tag')}
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-8 leading-tight">
                  {t('Info.title').slice(0, -1)}<span className="text-[#ff3f39]">.</span>
                </h2>
                <p className="text-stone-500 text-lg font-medium leading-relaxed mb-12">
                  {t('Info.desc')}
                </p>

                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-stone-900">{t('Info.location')}</h3>
                  
                  <div className="flex items-start gap-4 group">
                    <div className="w-6 h-6 rounded-full bg-[#fff0ef] flex items-center justify-center flex-shrink-0 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#ff3f39]" />
                    </div>
                    <p className="text-stone-500 font-medium">{t('Info.address')}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 group">
                    <div className="w-6 h-6 rounded-full bg-[#fff0ef] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-3.5 h-3.5 text-[#ff3f39]" />
                    </div>
                    <p className="text-stone-500 font-medium">{t('Info.email')}</p>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-6 h-6 rounded-full bg-[#fff0ef] flex items-center justify-center flex-shrink-0">
                      <Phone className="w-3.5 h-3.5 text-[#ff3f39]" />
                    </div>
                    <p className="text-stone-500 font-medium">{t('Info.phone')}</p>
                  </div>
                </div>

              </div>
            </AnimateOnScroll>

          </div>
        </div>
      </section>

      {/* 3. CTA SHORT BRIEF */}
      <section className="py-24 bg-white text-center border-t border-stone-100">
        <div className="container mx-auto px-6 max-w-3xl">
          <AnimateOnScroll animation="fade-up">
            <span className="inline-block bg-[#ff3f39] text-white font-bold px-4 py-1.5 text-xs mb-6 uppercase tracking-widest shadow-sm">
              {t('Cta.tag')}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-6 tracking-tight">
              {t('Cta.title').slice(0, -1)}<span className="text-[#ff3f39]">.</span>
            </h2>
            <p className="text-stone-500 text-lg font-medium leading-relaxed">
              {t('Cta.desc')}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

    </div>
  );
}
