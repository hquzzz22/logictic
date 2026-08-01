import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Calendar, User, ImageIcon } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';
import ArticleRenderer from '@/components/shop/ArticleRenderer';
import TableOfContents from '@/components/shop/TableOfContents';

// Helper: get localized value with fallback
function getLocalized(field: { en: string; vi: string } | string | undefined, locale: string): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  const primary = field[locale as 'en' | 'vi'] || '';
  if (primary) return primary;
  return locale === 'en' ? (field.vi || '') : (field.en || '');
}

async function getPost(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${apiUrl}/posts/slug/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: 'Not Found' };
  }

  const title = getLocalized(post.title, locale);
  const description = getLocalized(post.description, locale) || title;
  const imageUrl = post.image ? getImageUrl(post.image) : '/placeholder.jpg';

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${baseUrl}/${locale}/blog/${slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/${slug}`
    }
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const t = await getTranslations('BlogPage');
  
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const title = getLocalized(post.title, locale);
  const content = getLocalized(post.content, locale);
  const description = getLocalized(post.description, locale);
  
  let parsedBlocks = [];
  try {
    const parsed = JSON.parse(content);
    if (parsed && parsed.blocks) {
      parsedBlocks = parsed.blocks;
    }
  } catch (e) {}

  // JSON-LD Schema
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const schemaOrgJSONLD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/${locale}/blog/${slug}`,
    },
    headline: title,
    description: description || title,
    image: post.image ? getImageUrl(post.image) : `${baseUrl}/placeholder.jpg`,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Superman Transport',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Superman Transport',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.createdAt).toISOString(),
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }}
      />
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
                  {post.sidebarBanners.map((banner: any, idx: number) => (
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
