'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import ImageUploader from '@/components/admin/ImageUploader';

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  isPublished: boolean;
  createdAt: string;
  author?: { name: string };
}

const emptyForm = { title: '', slug: '', content: '', image: '', isPublished: true };

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

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

  const openCreate = () => {
    setEditingPost(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (post: Post) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      image: post.image || '',
      isPublished: post.isPublished,
    });
    setShowModal(true);
  };

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    setForm((f) => ({ ...f, title, slug: editingPost ? f.slug : slug }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingPost) {
        await api.put(`/posts/${editingPost._id}`, form);
        toast.success('Đã cập nhật bài viết');
      } else {
        await api.post('/posts', form);
        toast.success('Đã thêm bài viết mới');
      }
      setShowModal(false);
      fetchPosts();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Ngày tạo</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      Chưa có bài viết nào
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post._id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground max-w-xs truncate">{post.title}</td>
                      <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{post.slug}</td>
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
                        <button
                          onClick={() => openEdit(post)}
                          className="inline-flex items-center px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(post._id, post.title)}
                          className="inline-flex items-center px-2 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-foreground">
                {editingPost ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Tiêu đề *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Tiêu đề bài viết"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="tieu-de-bai-viet"
                />
              </div>
              <ImageUploader
                label="Ảnh bìa bài viết"
                value={form.image}
                onChange={(url) => setForm((f) => ({ ...f, image: url }))}
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nội dung *</label>
                <textarea
                  required
                  rows={8}
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  placeholder="Nội dung bài viết..."
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={form.isPublished}
                  onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                  className="h-4 w-4 text-primary rounded border-gray-300"
                />
                <label htmlFor="isPublished" className="text-sm font-medium text-foreground">
                  Xuất bản ngay
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                  {saving ? 'Đang lưu...' : editingPost ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
