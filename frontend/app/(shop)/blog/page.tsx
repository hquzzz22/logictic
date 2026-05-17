'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, User, ImageIcon } from 'lucide-react';
import api from '@/lib/api';
import PageBanner from '@/components/shop/PageBanner';

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  createdAt: string;
  author?: { name: string };
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/posts')
      .then(({ data }) => setPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-muted/10 min-h-screen">
      <PageBanner
        title="Tin Tức & Công Thức"
        subtitle="Khám phá các công thức nấu ăn ngon, mẹo bảo quản thực phẩm và tin tức mới nhất từ NôngSảnShop."
        breadcrumb="Trang chủ"
        tags={[
          { label: 'Công thức', emoji: '🍳' },
          { label: 'Mẹo hay', emoji: '💡' },
          { label: 'Tin tức', emoji: '📰' },
        ]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4">

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden animate-pulse">
                <div className="h-52 bg-stone-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-stone-200 rounded w-1/3" />
                  <div className="h-5 bg-stone-200 rounded w-full" />
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-lg">Chưa có bài viết nào. Hãy quay lại sau!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post._id} className="group bg-white rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
                <Link href={`/blog/${post.slug}`} className="block relative h-52 bg-stone-100 overflow-hidden">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-stone-300" />
                    </div>
                  )}
                </Link>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    {post.author && (
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {post.author.name}
                      </span>
                    )}
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4 leading-relaxed">
                    {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-sm text-primary font-semibold hover:underline"
                  >
                    Đọc thêm <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        </div>
      </section>
    </div>
  );
}
