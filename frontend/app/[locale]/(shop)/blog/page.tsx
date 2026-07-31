'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { ArrowRight, Calendar, User, ImageIcon, TrendingUp, Lightbulb, Newspaper } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import AnimateOnScroll from '@/components/shop/AnimateOnScroll';

interface Post {
  _id: string;
  title: { en: string; vi: string } | string;
  slug: string;
  content: { en: string; vi: string } | string;
  image: string;
  createdAt: string;
  author?: { name: string };
}

// Helper: get localized value with fallback
function getLocalized(field: { en: string; vi: string } | string, locale: string): string {
  if (typeof field === 'string') return field;
  const primary = field[locale as 'en' | 'vi'] || '';
  if (primary) return primary;
  // Fallback to other language
  return locale === 'en' ? (field.vi || '') : (field.en || '');
}

function extractText(contentStr: string) {
  try {
    const data = JSON.parse(contentStr);
    if (!data || !data.blocks) return contentStr.substring(0, 150);
    const texts = data.blocks
      .map((block: any) => {
        if (block.type === 'paragraph' || block.type === 'header') {
          return block.data.text.replace(/<[^>]*>/g, '');
        }
        return '';
      })
      .filter(Boolean);
    return texts.join(' ').substring(0, 150);
  } catch (e) {
    return contentStr.replace(/<[^>]*>/g, '').substring(0, 150);
  }
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const t = useTranslations('BlogPage');

  useEffect(() => {
    api.get('/posts')
      .then(({ data }) => setPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tags = [
    { label: t('tags.0'), icon: TrendingUp },
    { label: t('tags.1'), icon: Lightbulb },
    { label: t('tags.2'), icon: Newspaper },
  ];

  return (
    <div className="bg-[#f5f6f8] min-h-screen font-sans selection:bg-[#ff3f39] selection:text-white pb-0">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-800 via-stone-900 to-black z-0" />
        
        {/* Subtle animated pattern */}
        <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="container mx-auto px-6 relative z-10 text-center flex flex-col h-full justify-center pt-20">
          <AnimateOnScroll animation="fade-up" className="max-w-4xl mx-auto">
            <span className="inline-block bg-[#ff3f39] text-white font-bold px-4 py-1.5 text-xs mb-6 uppercase tracking-widest shadow-sm">
              {t('Hero.tag')}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8">
              {t('Hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-medium leading-relaxed mb-12 max-w-3xl mx-auto">
              {t('Hero.desc')}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {tags.map((tag, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/10 text-white text-sm font-bold uppercase tracking-wider rounded shadow-2xl hover:bg-white/20 transition-colors cursor-default"
                >
                  <tag.icon className="w-4 h-4 text-[#ff3f39]" />
                  {tag.label}
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* 2. BLOG POSTS */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden animate-pulse">
                  <div className="h-64 bg-stone-100" />
                  <div className="p-8 space-y-4">
                    <div className="h-4 bg-stone-100 rounded w-1/3 mb-4" />
                    <div className="h-6 bg-stone-100 rounded w-full" />
                    <div className="h-6 bg-stone-100 rounded w-5/6 mb-4" />
                    <div className="h-4 bg-stone-100 rounded w-full" />
                    <div className="h-4 bg-stone-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-xl shadow-sm border border-stone-100">
              <Newspaper className="h-16 w-16 text-stone-200 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-stone-900 mb-2">{t('empty.title')}</h3>
              <p className="text-stone-500 font-medium">{t('empty.desc')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post, index) => {
                const title = getLocalized(post.title, locale);
                const content = getLocalized(post.content, locale);
                
                return (
                  <AnimateOnScroll key={post._id} animation="fade-up" delay={index * 100}>
                    <article className="group bg-white rounded-xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                      <Link href={`/blog/${post.slug}`} className="block relative h-64 bg-stone-50 overflow-hidden">
                        {post.image ? (
                          <img
                            src={getImageUrl(post.image)}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-stone-50">
                            <ImageIcon className="h-12 w-12 text-stone-200" />
                          </div>
                        )}
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </Link>
                      
                      <div className="p-8 flex flex-col flex-grow">
                        <div className="flex items-center gap-4 text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-[#ff3f39]" />
                            {new Date(post.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                          </span>
                          {post.author && (
                            <span className="flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5 text-[#ff3f39]" />
                              {post.author.name}
                            </span>
                          )}
                        </div>
                        
                        <Link href={`/blog/${post.slug}`}>
                          <h2 className="text-xl font-bold text-stone-900 mb-4 group-hover:text-[#ff3f39] transition-colors line-clamp-2 leading-snug">
                            {title}
                          </h2>
                        </Link>
                        
                        <p className="text-stone-500 text-sm font-medium leading-relaxed line-clamp-3 mb-8 flex-grow">
                          {extractText(content)}...
                        </p>
                        
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center text-sm text-stone-900 font-bold uppercase tracking-widest group-hover:text-[#ff3f39] transition-colors mt-auto"
                        >
                          {t('readMore')}
                          <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </article>
                  </AnimateOnScroll>
                );
              })}
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
