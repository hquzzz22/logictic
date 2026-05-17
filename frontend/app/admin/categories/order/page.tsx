'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, GripVertical, Eye, EyeOff, Save, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Category {
  _id: string;
  name: string;
  slug: string;
  order: number;
  showOnHome: boolean;
}

export default function CategoryOrderPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await api.get('/categories');
      // Sort by current order
      const sorted = data
        .map((c: Category & { order?: number; showOnHome?: boolean }) => ({
          ...c,
          order: c.order ?? 0,
          showOnHome: c.showOnHome !== false,
        }))
        .sort((a: Category, b: Category) => a.order - b.order);
      setCategories(sorted);
    } catch {
      toast.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= categories.length) return;
    const items = [...categories];
    [items[index], items[target]] = [items[target], items[index]];
    // Re-assign order numbers
    items.forEach((item, i) => { item.order = i; });
    setCategories(items);
    setHasChanges(true);
  };

  const toggleShowOnHome = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c._id === id ? { ...c, showOnHome: !c.showOnHome } : c))
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/categories/reorder', {
        items: categories.map((c, i) => ({
          _id: c._id,
          order: i,
          showOnHome: c.showOnHome,
        })),
      });
      toast.success('Đã lưu thứ tự danh mục!');
      setHasChanges(false);
    } catch {
      toast.error('Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/categories" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sắp xếp danh mục</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Kéo/bấm mũi tên để thay đổi thứ tự hiển thị trên trang chủ</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20 text-sm"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      {/* Info */}
      <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3">
        💡 Danh mục ở trên sẽ hiển thị trước trên trang chủ. Bấm icon 👁 để ẩn/hiện danh mục khỏi trang chủ.
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="px-6 py-12 text-center text-muted-foreground">
            Chưa có danh mục nào. <Link href="/admin/categories" className="text-primary hover:underline">Thêm danh mục</Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {categories.map((cat, index) => (
              <div
                key={cat._id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', index.toString());
                  e.currentTarget.classList.add('opacity-50');
                }}
                onDragEnd={(e) => {
                  e.currentTarget.classList.remove('opacity-50');
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('bg-primary/5', 'border-l-4', 'border-l-primary');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('bg-primary/5', 'border-l-4', 'border-l-primary');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('bg-primary/5', 'border-l-4', 'border-l-primary');
                  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                  if (fromIndex === index) return;
                  const items = [...categories];
                  const [moved] = items.splice(fromIndex, 1);
                  items.splice(index, 0, moved);
                  items.forEach((item, i) => { item.order = i; });
                  setCategories(items);
                  setHasChanges(true);
                }}
                className={`flex items-center gap-4 px-5 py-4 transition-all cursor-grab active:cursor-grabbing ${
                  !cat.showOnHome ? 'bg-muted/50 opacity-60' : 'hover:bg-muted/30'
                }`}
              >
                {/* Grip icon */}
                <div className="text-muted-foreground/40">
                  <GripVertical className="h-5 w-5" />
                </div>

                {/* Order number */}
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground text-sm">{cat.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{cat.slug}</div>
                </div>

                {/* Show/hide toggle */}
                <button
                  type="button"
                  onClick={() => toggleShowOnHome(cat._id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    cat.showOnHome
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                  title={cat.showOnHome ? 'Đang hiện trên trang chủ — click để ẩn' : 'Đang ẩn — click để hiện'}
                >
                  {cat.showOnHome ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {cat.showOnHome ? 'Hiện' : 'Ẩn'}
                </button>

                {/* Move buttons */}
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === categories.length - 1}
                    className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {hasChanges && (
        <div className="text-center text-sm text-amber-600 font-medium animate-pulse">
          ⚠️ Có thay đổi chưa lưu
        </div>
      )}
    </div>
  );
}
