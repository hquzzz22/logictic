'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Send, Globe, Check, AlertCircle, Plus, Trash2 } from 'lucide-react';
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
  name: { en: string; vi: string };
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

// Helper: normalize bilingual field from DB (handles old string format)
function normalizeBilingual(value: any): { en: string; vi: string } {
  if (!value) return { en: '', vi: '' };
  if (typeof value === 'string') return { en: value, vi: '' };
  return { en: value.en || '', vi: value.vi || '' };
}

// Helper to get display name from bilingual category
function getCatName(cat: PostCategory) {
  return cat.name?.en || cat.name?.vi || (cat.name as any) || '';
}

// Helper: parse EditorJS content string to data object
function parseContent(str: string): Record<string, unknown> {
  if (!str) return { blocks: [] };
  try {
    return JSON.parse(str);
  } catch {
    return { blocks: [] };
  }
}

type Lang = 'en' | 'vi';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const userInfo = useUserStore((state) => state.userInfo);

  const [loading, setLoading] = useState(true);

  // Shared fields
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sidebarBanners, setSidebarBanners] = useState<{ image: string; url: string }[]>([]);

  // Bilingual fields
  const [titleEn, setTitleEn] = useState('');
  const [titleVi, setTitleVi] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descVi, setDescVi] = useState('');
  const [contentEn, setContentEn] = useState<Record<string, unknown>>({ blocks: [] });
  const [contentVi, setContentVi] = useState<Record<string, unknown>>({ blocks: [] });

  // Initial data for EditorJS (set once on load)
  const [initialContentEn, setInitialContentEn] = useState<Record<string, unknown> | undefined>(undefined);
  const [initialContentVi, setInitialContentVi] = useState<Record<string, unknown> | undefined>(undefined);

  // Language tab state
  const [activeLang, setActiveLang] = useState<Lang>('en');
  const [editorKeyEn, setEditorKeyEn] = useState(0);
  const [editorKeyVi, setEditorKeyVi] = useState(0);
  const editorEnRef = useRef<any>(null);
  const editorViRef = useRef<any>(null);

  const slug = useMemo(() => slugify(titleEn || titleVi), [titleEn, titleVi]);

  const hasEn = !!(titleEn.trim() && ((contentEn as any)?.blocks?.length > 0));
  const hasVi = !!(titleVi.trim() && ((contentVi as any)?.blocks?.length > 0));

  useEffect(() => {
    Promise.all([
      api.get('/post-categories'),
      api.get(`/posts/${params.id}`)
    ])
      .then(([catsRes, postRes]) => {
        setCategories(catsRes.data);
        const post = postRes.data;

        // Handle bilingual title
        const title = normalizeBilingual(post.title);
        setTitleEn(title.en);
        setTitleVi(title.vi);

        // Handle bilingual description
        const desc = normalizeBilingual(post.description);
        setDescEn(desc.en);
        setDescVi(desc.vi);

        setImage(post.image || '');
        setSidebarBanners(post.sidebarBanners || []);
        setCategory(post.category?._id || post.category || '');
        setTags(post.tags ? post.tags.join(', ') : '');
        setIsPublished(post.isPublished);

        // Handle bilingual content
        const content = normalizeBilingual(post.content);
        const parsedEn = parseContent(content.en);
        const parsedVi = parseContent(content.vi);

        setContentEn(parsedEn);
        setContentVi(parsedVi);
        setInitialContentEn(parsedEn);
        setInitialContentVi(parsedVi);
      })
      .catch(() => {
        toast.error('Không thể tải dữ liệu bài viết');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

  const copyFromEn = () => {
    if (!confirm('Bạn có chắc muốn sao chép toàn bộ nội dung từ bản Tiếng Anh sang? Nội dung Tiếng Việt hiện tại sẽ bị ghi đè.')) return;
    setTitleVi(titleEn);
    setContentVi(contentEn);
    setInitialContentVi(contentEn);
    setEditorKeyVi(prev => prev + 1);
  };

  const copyFromVi = () => {
    if (!confirm('Bạn có chắc muốn sao chép toàn bộ nội dung từ bản Tiếng Việt sang? Nội dung Tiếng Anh hiện tại sẽ bị ghi đè.')) return;
    setTitleEn(titleVi);
    setContentEn(contentVi);
    setInitialContentEn(contentVi);
    setEditorKeyEn(prev => prev + 1);
  };

  const handleSave = async (publish: boolean) => {
    if (!titleEn.trim() && !titleVi.trim()) {
      toast.error('Vui lòng nhập tiêu đề bài viết (ít nhất 1 ngôn ngữ)');
      return;
    }

    let finalContentEn = contentEn;
    let finalContentVi = contentVi;

    try {
      if (editorEnRef.current) {
        finalContentEn = await editorEnRef.current.save();
        setContentEn(finalContentEn);
      }
    } catch (e) {
      toast.error('Lỗi ở nội dung Tiếng Anh (vd: ảnh tải bị lỗi hoặc block không hợp lệ).');
      return;
    }

    try {
      if (editorViRef.current) {
        finalContentVi = await editorViRef.current.save();
        setContentVi(finalContentVi);
      }
    } catch (e) {
      toast.error('Lỗi ở nội dung Tiếng Việt (vd: ảnh tải bị lỗi hoặc block không hợp lệ).');
      return;
    }

    const enBlocks = (finalContentEn as any)?.blocks || [];
    const viBlocks = (finalContentVi as any)?.blocks || [];
    if (enBlocks.length === 0 && viBlocks.length === 0) {
      toast.error('Nội dung bài viết không được để trống (ít nhất 1 ngôn ngữ)');
      return;
    }

    setSaving(true);
    try {
      await api.put(`/posts/${params.id}`, {
        title: { en: titleEn.trim(), vi: titleVi.trim() },
        slug,
        content: {
          en: enBlocks.length > 0 ? JSON.stringify(finalContentEn) : '',
          vi: viBlocks.length > 0 ? JSON.stringify(finalContentVi) : '',
        },
        description: { en: descEn.trim(), vi: descVi.trim() },
        image,
        sidebarBanners,
        category: category || undefined,
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        isPublished: publish,
      });
      toast.success('Đã cập nhật bài viết!');
      router.push('/admin/posts');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-foreground">Chỉnh sửa bài viết</h1>
          </div>

          {/* Language Tabs */}
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border w-fit">
              <button
                onClick={() => setActiveLang('en')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeLang === 'en'
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="text-base">🇺🇸</span>
                English
                {hasEn ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : titleEn || ((contentEn as any)?.blocks?.length > 0) ? (
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                ) : null}
              </button>
              <button
                onClick={() => setActiveLang('vi')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeLang === 'vi'
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="text-base">🇻🇳</span>
                Tiếng Việt
                {hasVi ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : titleVi || ((contentVi as any)?.blocks?.length > 0) ? (
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                ) : null}
              </button>
            </div>
            
            {activeLang === 'vi' && (
              <button type="button" onClick={copyFromEn} className="text-sm text-primary font-medium hover:underline flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-primary/5 transition-colors">
                <span className="text-base">🇺🇸</span> Sao chép từ Tiếng Anh
              </button>
            )}
            {activeLang === 'en' && (
              <button type="button" onClick={copyFromVi} className="text-sm text-primary font-medium hover:underline flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-primary/5 transition-colors">
                <span className="text-base">🇻🇳</span> Sao chép từ Tiếng Việt
              </button>
            )}
          </div>

          {/* EN Tab */}
          <div className={activeLang === 'en' ? 'block' : 'hidden'}>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="Title (English)..."
              className="w-full px-0 py-3 text-3xl font-bold text-foreground placeholder:text-muted-foreground/40 border-0 border-b-2 border-border focus:border-primary focus:outline-none transition-colors bg-transparent"
            />
            <div className="mt-6">
              {initialContentEn !== undefined && (
                <EditorJSComponent
                  key={`editor-en-${editorKeyEn}`}
                  holderId="editorjs-en"
                  initialData={initialContentEn}
                  onChange={setContentEn}
                  token={userInfo?.token || ''}
                  editorInstance={(editor) => { editorEnRef.current = editor; }}
                />
              )}
            </div>
          </div>

          {/* VI Tab */}
          <div className={activeLang === 'vi' ? 'block' : 'hidden'}>
            <input
              type="text"
              value={titleVi}
              onChange={(e) => setTitleVi(e.target.value)}
              placeholder="Tiêu đề (Tiếng Việt)..."
              className="w-full px-0 py-3 text-3xl font-bold text-foreground placeholder:text-muted-foreground/40 border-0 border-b-2 border-border focus:border-primary focus:outline-none transition-colors bg-transparent"
            />
            <div className="mt-6">
              {initialContentVi !== undefined && (
                <EditorJSComponent
                  key={`editor-vi-${editorKeyVi}`}
                  holderId="editorjs-vi"
                  initialData={initialContentVi}
                  onChange={setContentVi}
                  token={userInfo?.token || ''}
                  editorInstance={(editor) => { editorViRef.current = editor; }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-5 bg-white rounded-xl border border-border p-5 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Cài đặt bài viết
            </h3>

            {/* Translation Status */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trạng thái dịch</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-base">🇺🇸</span>
                <span className={`font-medium ${hasEn ? 'text-green-600' : 'text-stone-400'}`}>
                  {hasEn ? '✓ Đã có nội dung' : 'Chưa có nội dung'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-base">🇻🇳</span>
                <span className={`font-medium ${hasVi ? 'text-green-600' : 'text-stone-400'}`}>
                  {hasVi ? '✓ Đã có nội dung' : 'Chưa có nội dung'}
                </span>
              </div>
            </div>

            {/* Ảnh đại diện */}
            <ImageUploader label="Ảnh đại diện" value={image} onChange={setImage} />

            {/* Banners Quảng cáo (Sidebar) */}
            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Banners Sidebar (Tuỳ chọn)</h4>
                <button
                  type="button"
                  onClick={() => setSidebarBanners([...sidebarBanners, { image: '', url: '' }])}
                  className="flex items-center gap-1 text-xs text-primary bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded-md transition-colors"
                >
                  <Plus className="h-3 w-3" /> Thêm Banner
                </button>
              </div>
              
              {sidebarBanners.length === 0 && (
                <p className="text-xs text-muted-foreground italic">Chưa có banner nào.</p>
              )}

              {sidebarBanners.map((banner, idx) => (
                <div key={idx} className="p-3 bg-stone-50 border border-border rounded-xl space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => setSidebarBanners(sidebarBanners.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-md transition-colors z-10"
                    title="Xóa Banner"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <ImageUploader 
                    label={`Ảnh Banner ${idx + 1}`} 
                    value={banner.image} 
                    onChange={(img) => {
                      const newBanners = [...sidebarBanners];
                      newBanners[idx].image = img;
                      setSidebarBanners(newBanners);
                    }} 
                  />
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Link đích (Target URL)</label>
                    <input 
                      type="text" 
                      value={banner.url} 
                      onChange={(e) => {
                        const newBanners = [...sidebarBanners];
                        newBanners[idx].url = e.target.value;
                        setSidebarBanners(newBanners);
                      }}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="https://..." 
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Danh mục */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Danh mục</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">-- Không chọn --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{getCatName(cat)}</option>
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

            {/* Mô tả ngắn (SEO) */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Mô tả SEO ({activeLang === 'en' ? '🇺🇸 EN' : '🇻🇳 VI'})
              </label>
              {activeLang === 'en' ? (
                <textarea rows={3} value={descEn} onChange={(e) => setDescEn(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Brief description for SEO..." />
              ) : (
                <textarea rows={3} value={descVi} onChange={(e) => setDescVi(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Mô tả ngắn cho SEO..." />
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Thẻ (Tags)</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="logistics, freight, shipping..." />
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
