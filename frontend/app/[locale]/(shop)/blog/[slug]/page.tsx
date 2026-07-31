'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, User, ImageIcon } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import ArticleRenderer from '@/components/shop/ArticleRenderer';
import TableOfContents from '@/components/shop/TableOfContents';

interface Post {
  _id: string;
  title: { en: string; vi: string } | string;
  slug: string;
  content: { en: string; vi: string } | string;
  description: { en: string; vi: string } | string;
  image: string;
  sidebarBanners?: { image: string; url: string }[];
  createdAt: string;
  author?: { name: string };
}

// Helper: get localized value with fallback
function getLocalized(field: { en: string; vi: string } | string | undefined, locale: string): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  const primary = field[locale as 'en' | 'vi'] || '';
  if (primary) return primary;
  return locale === 'en' ? (field.vi || '') : (field.en || '');
}

export default function BlogDetailPage() {
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations('BlogPage');
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/posts/slug/${params.slug}`)
      .then(({ data }) => setPost(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-3xl animate-pulse space-y-4">
          <div className="h-8 bg-stone-200 rounded w-3/4" />
          <div className="h-4 bg-stone-200 rounded w-1/3" />
          <div className="h-72 bg-stone-200 rounded-2xl" />
          <div className="space-y-2">
            {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-stone-200 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Không tìm thấy bài viết</h2>
          <Link href="/blog" className="text-primary hover:underline">← {t('backToBlog')}</Link>
        </div>
      </div>
    );
  }

  const title = getLocalized(post.title, locale);
  const content = getLocalized(post.content, locale);

  let parsedBlocks = [];
  try {
    const parsed = JSON.parse(content);
    if (parsed && parsed.blocks) {
      parsedBlocks = parsed.blocks;
    }
  } catch (e) {}

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t('backToBlog')}
        </Link>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3">
            <article>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            {title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {post.author.name}
              </span>
            )}
          </div>

          {post.image ? (
            <div className="relative w-full h-[50vh] md:h-[70vh] mb-8 rounded-2xl overflow-hidden">
              <img
                src={getImageUrl(post.image) || '/placeholder.jpg'}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-48 rounded-2xl bg-stone-100 flex items-center justify-center mb-8">
              <ImageIcon className="h-16 w-16 text-stone-300" />
            </div>
          )}

          <ArticleRenderer content={content} />
        </article>

            <div className="mt-12 pt-8 border-t border-border">
              <Link
                href="/blog"
                className="inline-flex items-center text-primary font-semibold hover:underline"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t('viewAll')}
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 hidden lg:block relative">
            <div className="sticky top-32 space-y-8 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar pr-1 pb-4">
              <TableOfContents blocks={parsedBlocks} />
              
              {post.sidebarBanners && post.sidebarBanners.length > 0 && (
                <div className="space-y-6">
                  {post.sidebarBanners.map((banner, idx) => (
                    banner.image && (
                      <div key={idx} className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm transition-transform hover:-translate-y-1 duration-300">
                        {banner.url ? (
                          <a href={banner.url} target="_blank" rel="noopener noreferrer" className="block">
                            <img src={getImageUrl(banner.image)} alt={`Advertisement ${idx + 1}`} className="w-full h-auto object-cover" />
                          </a>
                        ) : (
                          <img src={getImageUrl(banner.image)} alt={`Advertisement ${idx + 1}`} className="w-full h-auto object-cover" />
                        )}
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
