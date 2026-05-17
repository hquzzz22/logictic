'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Send } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import ImageUploader from '@/components/admin/ImageUploader';
import { useUserStore } from '@/store/userStore';

// Load EditorJS chỉ phía client (không SSR)
const EditorJSComponent = dynamic(
  () => import('@/components/admin/editor/EditorJS'),
  { ssr: false, loading: () => <div className="min-h-[400px] bg-white border border-border rounded-2xl flex items-center justify-center text-muted-foreground text-sm">Đang tải editor...</div> }
);

interface PostCategory {
  _id: string;
  name: string;
  slug: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function NewPostPage() {
  const router = useRouter();
  const userInfo = useUserStore((state) => state.userInfo);

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<Record<string, unknown>>({ blocks: [] });

  const slug = useMemo(() => slugify(title), [title]);

  useEffect(() => {
    api.get('/post-categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const handleSave = async (publish: boolean) => {
    if (!title.trim()) { toast.error('Vui lòng nhập tiêu đề bài viết'); return; }

    const blocks = (content as any)?.blocks || [];
    if (blocks.length === 0) { toast.error('Nội dung bài viết không được để trống'); return; }

    setSaving(true);
    try {
      await api.post('/posts', {
        title: title.trim(),
        slug,
        // Lưu content dạng JSON string để render lại bằng ArticleRenderer
        content: JSON.stringify(content),
        image,
        category: category || undefined,
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        isPublished: publish,
      });
      toast.success(publish ? 'Đã xuất bản bài viết!' : 'Đã lưu nháp!');
      router.push('/admin/posts');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/admin/posts" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Quay lại danh sách
        </Link>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => handleSave(false)} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-colors text-sm disabled:opacity-70">
            <Save className="h-4 w-4" />
            Lưu nháp
          </button>
          <button type="button" onClick={() => handleSave(true)} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-70 shadow-md shadow-primary/20">
            <Send className="h-4 w-4" />
            Xuất bản
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main editor */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Viết bài mới</h1>
            <p className="text-sm text-muted-foreground mt-1">Nội dung sẽ được admin kiểm duyệt</p>
          </div>

          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tiêu đề bài viết..."
            className="w-full px-0 py-3 text-3xl font-bold text-foreground placeholder:text-muted-foreground/40 border-0 border-b-2 border-border focus:border-primary focus:outline-none transition-colors bg-transparent"
          />

          {/* EditorJS */}
          <EditorJSComponent
            onChange={setContent}
            token={userInfo?.token || ''}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-5 bg-white rounded-xl border border-border p-5 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <h3 className="font-bold text-foreground text-base">Cài đặt bài viết</h3>

            {/* Ảnh đại diện */}
            <ImageUploader label="Ảnh đại diện" value={image} onChange={setImage} />

            {/* Danh mục */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Danh mục</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">-- Không chọn --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Slug */}
            {slug && (
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Slug URL</label>
                <p className="text-xs text-primary bg-primary/5 px-3 py-2 rounded-lg break-all font-mono">{slug}</p>
              </div>
            )}

            {/* Mô tả ngắn */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Mô tả ngắn</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Tóm tắt nội dung bài viết..." />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Thẻ (Tags)</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="cong-thuc, kho-bo, kho-ga..." />
              <p className="text-xs text-muted-foreground mt-1">Phân cách bằng dấu phẩy</p>
              {tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Publish toggle */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <input type="checkbox" id="publishToggle" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
              <label htmlFor="publishToggle" className="text-sm font-medium text-foreground">Xuất bản ngay</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
