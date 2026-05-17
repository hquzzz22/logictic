'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, User, ImageIcon } from 'lucide-react';
import api from '@/lib/api';

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  createdAt: string;
  author?: { name: string };
}

export default function BlogDetailPage() {
  const params = useParams();
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
          <Link href="/blog" className="text-primary hover:underline">← Quay lại Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Quay lại Blog
        </Link>

        <article>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {post.author.name}
              </span>
            )}
          </div>

          {post.image ? (
            <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-8 bg-stone-100">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="h-48 rounded-2xl bg-stone-100 flex items-center justify-center mb-8">
              <ImageIcon className="h-16 w-16 text-stone-300" />
            </div>
          )}

          <div className="prose prose-stone max-w-none text-foreground leading-relaxed">
            {post.content.split('\n').map((paragraph, i) => (
              paragraph.trim() ? (
                <p key={i} className="mb-4 text-base text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ) : <br key={i} />
            ))}
          </div>
        </article>

        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary font-semibold hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Xem tất cả bài viết
          </Link>
        </div>
      </div>
    </div>
  );
}
