'use client';

import { useState, useEffect } from 'react';
import { Save, Phone, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface ContactButtons {
  phone: { label: string; number: string; enabled: boolean };
  zalo: { label: string; id: string; enabled: boolean };
  messenger: { label: string; id: string; enabled: boolean };
}

const defaultButtons: ContactButtons = {
  phone: { label: '0123 456 789', number: '0123456789', enabled: true },
  zalo: { label: 'Chat Zalo', id: 'https://zalo.me/0123456789', enabled: true },
  messenger: { label: 'Messenger', id: 'https://m.me/spmt', enabled: true },
};

export default function AdminSettings() {
  const [buttons, setButtons] = useState<ContactButtons>(defaultButtons);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings/contactButtons')
      .then(({ data }) => { if (data) setButtons(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings/contactButtons', { value: buttons });
      toast.success('Đã lưu cài đặt liên hệ!');
    } catch {
      toast.error('Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cài đặt liên hệ</h1>
          <p className="text-sm text-muted-foreground mt-1">Cấu hình 3 nút liên hệ hiển thị trên trang sản phẩm</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-md shadow-primary/20 text-sm"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      {/* Preview */}
      <div className="bg-muted/30 border border-border rounded-2xl p-6">
        <p className="text-sm font-medium text-muted-foreground mb-3">Xem trước:</p>
        <p className="text-sm text-muted-foreground mb-2">Liên hệ đặt hàng qua:</p>
        <div className="grid grid-cols-3 gap-2">
          {buttons.phone.enabled && (
            <div className="bg-green-600 text-white font-bold h-11 rounded-full flex items-center justify-center gap-1.5 text-xs">
              <Phone className="h-4 w-4" /> {buttons.phone.label}
            </div>
          )}
          {buttons.zalo.enabled && (
            <div className="bg-[#e62c26] text-white font-bold h-11 rounded-full flex items-center justify-center gap-1.5 text-xs">
              <img src="/logo_zalo.png" alt="Zalo" className="h-5 w-5 object-contain" /> {buttons.zalo.label}
            </div>
          )}
          {buttons.messenger.enabled && (
            <div className="bg-gradient-to-r from-[#0695FF] via-[#A334FA] to-[#FF6968] text-white font-bold h-11 rounded-full flex items-center justify-center gap-1.5 text-xs">
              <MessageCircle className="h-4 w-4" /> {buttons.messenger.label}
            </div>
          )}
        </div>
      </div>

      {/* Phone config */}
      <div className="bg-white border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><Phone className="h-4 w-4 text-green-600" /></div>
            Số điện thoại
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={buttons.phone.enabled} onChange={(e) => setButtons({ ...buttons, phone: { ...buttons.phone, enabled: e.target.checked } })}
              className="h-4 w-4 text-primary rounded" />
            <span className="text-sm text-muted-foreground">Hiển thị</span>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Số điện thoại</label>
            <input type="text" value={buttons.phone.number} onChange={(e) => setButtons({ ...buttons, phone: { ...buttons.phone, number: e.target.value } })}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="0123456789" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Text hiển thị trên nút</label>
            <input type="text" value={buttons.phone.label} onChange={(e) => setButtons({ ...buttons, phone: { ...buttons.phone, label: e.target.value } })}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="0123 456 789" />
          </div>
        </div>
      </div>

      {/* Zalo config */}
      <div className="bg-white border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-[#ffe4e2] rounded-lg flex items-center justify-center"><img src="/logo_zalo.png" alt="" className="h-5 w-5 object-contain" /></div>
            Zalo
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={buttons.zalo.enabled} onChange={(e) => setButtons({ ...buttons, zalo: { ...buttons.zalo, enabled: e.target.checked } })}
              className="h-4 w-4 text-primary rounded" />
            <span className="text-sm text-muted-foreground">Hiển thị</span>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Link Zalo (dán link đầy đủ)</label>
            <input type="text" value={buttons.zalo.id} onChange={(e) => setButtons({ ...buttons, zalo: { ...buttons.zalo, id: e.target.value } })}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="https://zalo.me/0123456789" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Text hiển thị trên nút</label>
            <input type="text" value={buttons.zalo.label} onChange={(e) => setButtons({ ...buttons, zalo: { ...buttons.zalo, label: e.target.value } })}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Chat Zalo" />
          </div>
        </div>
      </div>

      {/* Messenger config */}
      <div className="bg-white border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"><MessageCircle className="h-4 w-4 text-purple-600" /></div>
            Messenger
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={buttons.messenger.enabled} onChange={(e) => setButtons({ ...buttons, messenger: { ...buttons.messenger, enabled: e.target.checked } })}
              className="h-4 w-4 text-primary rounded" />
            <span className="text-sm text-muted-foreground">Hiển thị</span>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Link Messenger (dán link đầy đủ)</label>
            <input type="text" value={buttons.messenger.id} onChange={(e) => setButtons({ ...buttons, messenger: { ...buttons.messenger, id: e.target.value } })}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="https://m.me/spmt" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Text hiển thị trên nút</label>
            <input type="text" value={buttons.messenger.id} onChange={(e) => setButtons({ ...buttons, messenger: { ...buttons.messenger, id: e.target.value } })}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="https://m.me/spmt" />
          </div>
        </div>
      </div>
    </div>
  );
}
