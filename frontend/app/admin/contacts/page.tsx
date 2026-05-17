'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mail, MailOpen, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);

  const fetch = useCallback(async () => {
    try {
      const { data } = await api.get('/contacts');
      setContacts(data);
    } catch { toast.error('Lỗi tải tin nhắn'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleRead = async (contact: Contact) => {
    setSelected(contact);
    if (!contact.isRead) {
      await api.put(`/contacts/${contact._id}/read`);
      setContacts((prev) => prev.map((c) => c._id === contact._id ? { ...c, isRead: true } : c));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa tin nhắn này?')) return;
    await api.delete(`/contacts/${id}`);
    setContacts((prev) => prev.filter((c) => c._id !== id));
    if (selected?._id === id) setSelected(null);
    toast.success('Đã xóa');
  };

  const unreadCount = contacts.filter((c) => !c.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Tin nhắn liên hệ
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
              {unreadCount} mới
            </span>
          )}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Chưa có tin nhắn nào</p>
            </div>
          ) : (
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {contacts.map((c) => (
                <button
                  key={c._id}
                  onClick={() => handleRead(c)}
                  className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${selected?._id === c._id ? 'bg-primary/5' : ''} ${!c.isRead ? 'bg-amber-50/50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!c.isRead ? 'bg-primary' : 'bg-transparent'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm truncate ${!c.isRead ? 'font-bold text-foreground' : 'font-medium text-foreground'}`}>{c.name}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{new Date(c.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <p className="text-xs text-primary font-medium truncate mt-0.5">{c.subject}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{c.message}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3 bg-white rounded-xl border shadow-sm p-6">
          {selected ? (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground">{selected.subject}</h2>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{new Date(selected.createdAt).toLocaleString('vi-VN')}</span>
                    <span className="flex items-center gap-1">
                      {selected.isRead ? <MailOpen className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5 text-primary" />}
                      {selected.isRead ? 'Đã đọc' : 'Chưa đọc'}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleDelete(selected._id)} className="text-muted-foreground hover:text-red-500 transition-colors" title="Xóa">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-muted/30 rounded-xl">
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">Họ tên</div>
                  <div className="text-sm font-medium text-foreground">{selected.name}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">Email</div>
                  <a href={`mailto:${selected.email}`} className="text-sm font-medium text-primary hover:underline">{selected.email}</a>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">Điện thoại</div>
                  {selected.phone ? (
                    <a href={`tel:${selected.phone}`} className="text-sm font-medium text-primary hover:underline">{selected.phone}</a>
                  ) : (
                    <span className="text-sm text-muted-foreground">Không có</span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground uppercase font-semibold mb-2">Nội dung</div>
                <div className="text-sm text-foreground leading-relaxed whitespace-pre-line bg-white border border-border rounded-xl p-4">
                  {selected.message}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <Mail className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Chọn tin nhắn để xem chi tiết</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
