'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Post {
  _id: string;
  title: { en: string; vi: string } | string;
  slug: string;
  content: { en: string; vi: string } | string;
  image: string;
  category?: { _id: string; name: { en: string; vi: string } | string; slug: string };
  isPublished: boolean;
  createdAt: string;
  author?: { name: string };
}

function getCategoryLabel(cat?: Post['category']): string {
  if (!cat) return '—';
  if (typeof cat.name === 'string') return cat.name;
  return cat.name?.vi || cat.name?.en || '—';
}

// Helper: get display title from bilingual or legacy string format
function getTitle(post: Post): string {
  if (typeof post.title === 'string') return post.title;
  return post.title?.en || post.title?.vi || '(Chưa có tiêu đề)';
}

// Helper: check which languages have content
function getLangBadges(post: Post): { en: boolean; vi: boolean } {
  const title = typeof post.title === 'string'
    ? { en: post.title, vi: '' }
    : post.title || { en: '', vi: '' };
  const content = typeof post.content === 'string'
    ? { en: post.content, vi: '' }
    : post.content || { en: '', vi: '' };
  return {
    en: !!(title.en && content.en),
    vi: !!(title.vi && content.vi),
  };
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const { data } = await api.get('/posts/admin');
      setPosts(data);
    } catch {
      toast.error('Không thể tải bài viết');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Xóa bài viết "${title}"?`)) return;
    try {
      await api.delete(`/posts/${id}`);
      toast.success('Đã xóa bài viết');
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error('Không thể xóa bài viết');
    }
  };

  const handleTogglePublish = async (post: Post) => {
    try {
      await api.put(`/posts/${post._id}`, { isPublished: !post.isPublished });
      toast.success(post.isPublished ? 'Đã ẩn bài viết' : 'Đã xuất bản bài viết');
      setPosts((prev) => prev.map((p) => p._id === post._id ? { ...p, isPublished: !p.isPublished } : p));
    } catch {
      toast.error('Có lỗi xảy ra');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Bài viết ({posts.length})</h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="mr-2 h-4 w-4" />
          Viết bài mới
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Tiêu đề</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Danh mục</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Ngôn ngữ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Ngày tạo</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      Chưa có bài viết nào
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => {
                    const badges = getLangBadges(post);
                    return (
                      <tr key={post._id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-foreground max-w-xs truncate">
                          {getTitle(post)}
                        </td>
                        <td className="px-6 py-4 text-xs">
                          <span className="inline-flex px-2.5 py-1 font-medium rounded-full bg-stone-100 text-stone-700">
                            {getCategoryLabel(post.category)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${badges.en ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                              🇺🇸 EN
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${badges.vi ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'}`}>
                              🇻🇳 VI
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${post.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {post.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 text-right space-x-1">
                          <button
                            onClick={() => handleTogglePublish(post)}
                            className={`inline-flex items-center px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${post.isPublished ? 'text-gray-600 bg-gray-50 hover:bg-gray-100' : 'text-green-600 bg-green-50 hover:bg-green-100'}`}
                            title={post.isPublished ? 'Ẩn bài viết' : 'Xuất bản'}
                          >
                            {post.isPublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                          <Link
                            href={`/admin/posts/edit/${post._id}`}
                            className="inline-flex items-center px-2 py-1.5 text-xs font-medium text-[#e62c26] bg-[#fff0ef] rounded-md hover:bg-[#ffe4e2] transition-colors"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post._id, getTitle(post))}
                            className="inline-flex items-center px-2 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
