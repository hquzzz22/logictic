'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface PostCategory {
  _id: string;
  name: { en: string; vi: string } | string;
  slug: string;
  description: { en: string; vi: string } | string;
}

// Helper: get display name from bilingual or string format
function getName(cat: PostCategory): string {
  if (typeof cat.name === 'string') return cat.name;
  return cat.name?.en || cat.name?.vi || '';
}

function getDesc(cat: PostCategory): string {
  if (typeof cat.description === 'string') return cat.description;
  return cat.description?.en || cat.description?.vi || '';
}

// Helper: extract bilingual values
function extractBilingual(value: any): { en: string; vi: string } {
  if (!value) return { en: '', vi: '' };
  if (typeof value === 'string') return { en: value, vi: '' };
  return { en: value.en || '', vi: value.vi || '' };
}

const emptyForm = { nameEn: '', nameVi: '', slug: '', descEn: '', descVi: '' };

export default function AdminPostCategories() {
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<PostCategory | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    try {
      const { data } = await api.get('/post-categories');
      setCategories(data);
    } catch { toast.error('Lỗi tải danh mục'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (c: PostCategory) => {
    setEditing(c);
    const name = extractBilingual(c.name);
    const desc = extractBilingual(c.description);
    setForm({
      nameEn: name.en,
      nameVi: name.vi,
      slug: c.slug,
      descEn: desc.en,
      descVi: desc.vi,
    });
    setShowModal(true);
  };

  const handleNameChange = (nameEn: string) => {
    const slug = nameEn.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
    setForm((f) => ({ ...f, nameEn, slug: editing ? f.slug : slug }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: { en: form.nameEn, vi: form.nameVi },
        slug: form.slug,
        description: { en: form.descEn, vi: form.descVi },
      };
      if (editing) {
        await api.put(`/post-categories/${editing._id}`, payload);
        toast.success('Đã cập nhật');
      } else {
        await api.post('/post-categories', payload);
        toast.success('Đã thêm');
      }
      setShowModal(false); fetch();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Có lỗi');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Xóa danh mục "${name}"?`)) return;
    try { await api.delete(`/post-categories/${id}`); toast.success('Đã xóa'); setCategories(p => p.filter(c => c._id !== id)); }
    catch { toast.error('Không thể xóa'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Danh mục bài viết ({categories.length})</h1>
        <button onClick={openCreate} className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
          <Plus className="mr-2 h-4 w-4" /> Thêm danh mục
        </button>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Tên (EN / VI)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Mô tả</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">Chưa có danh mục nào</td></tr>
                ) : categories.map(c => {
                  const name = extractBilingual(c.name);
                  return (
                    <tr key={c._id} className="hover:bg-muted/20">
                      <td className="px-6 py-4 text-sm">
                        <div className="font-medium text-foreground">{name.en || <span className="text-stone-300 italic">—</span>}</div>
                        <div className="text-muted-foreground text-xs mt-0.5">{name.vi || <span className="text-stone-300 italic">—</span>}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{c.slug}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">{getDesc(c) || '—'}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => openEdit(c)} className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-[#e62c26] bg-[#fff0ef] rounded-md hover:bg-[#ffe4e2]"><Edit className="h-3.5 w-3.5 mr-1" />Sửa</button>
                        <button onClick={() => handleDelete(c._id, getName(c))} className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"><Trash2 className="h-3.5 w-3.5 mr-1" />Xóa</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">{editing ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h2>
              <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Name EN */}
              <div>
                <label className="block text-sm font-medium mb-1">🇺🇸 Tên (English) *</label>
                <input required value={form.nameEn} onChange={e => handleNameChange(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. Market Insights" />
              </div>
              {/* Name VI */}
              <div>
                <label className="block text-sm font-medium mb-1">🇻🇳 Tên (Tiếng Việt)</label>
                <input value={form.nameVi} onChange={e => setForm(f => ({ ...f, nameVi: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="VD: Thông tin thị trường" />
              </div>
              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <input required value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="market-insights" />
              </div>
              {/* Description EN */}
              <div>
                <label className="block text-sm font-medium mb-1">🇺🇸 Mô tả (English)</label>
                <textarea rows={2} value={form.descEn} onChange={e => setForm(f => ({ ...f, descEn: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Brief description..." />
              </div>
              {/* Description VI */}
              <div>
                <label className="block text-sm font-medium mb-1">🇻🇳 Mô tả (Tiếng Việt)</label>
                <textarea rows={2} value={form.descVi} onChange={e => setForm(f => ({ ...f, descVi: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Mô tả ngắn..." />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted">Hủy</button>
                <button type="submit" disabled={saving} className="px-6 py-2 text-sm text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-70">{saving ? 'Đang lưu...' : editing ? 'Cập nhật' : 'Thêm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
