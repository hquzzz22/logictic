'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import PageBanner from '@/components/shop/PageBanner';
import api from '@/lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    api.post('/contacts', form)
      .then(() => {
        toast.success('Đã gửi tin nhắn! Chúng tôi sẽ phản hồi trong vòng 24h.');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      })
      .catch(() => toast.error('Có lỗi xảy ra, vui lòng thử lại'))
      .finally(() => setSending(false));
  };

  return (
    <div className="bg-muted/10 min-h-screen">
      <PageBanner
        title="Liên Hệ Với Chúng Tôi"
        subtitle="Bạn có câu hỏi, góp ý, hoặc cần hỗ trợ? Đội ngũ NôngSảnShop luôn sẵn sàng lắng nghe."
        breadcrumb="Trang chủ"
        tags={[
          { label: 'Hotline: 0123 456 789', emoji: '📞' },
          { label: 'Phản hồi trong 24h', emoji: '⚡' },
        ]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Thông tin liên hệ */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Thông tin liên hệ</h2>

              <div className="space-y-5">
                {[
                  { icon: MapPin, title: 'Địa chỉ', content: '123 Đường Nông Sản, Quận 1,\nTP. Hồ Chí Minh', color: 'text-red-500', bg: 'bg-red-50' },
                  { icon: Phone, title: 'Hotline', content: '0123 456 789\n(Hỗ trợ 8:00 - 20:00)', color: 'text-green-600', bg: 'bg-green-50' },
                  { icon: Mail, title: 'Email', content: 'contact@nongsanshop.vn\nhello@nongsanshop.vn', color: 'text-blue-600', bg: 'bg-blue-50' },
                  { icon: Clock, title: 'Giờ làm việc', content: 'Thứ 2 - Thứ 7: 8:00 - 20:00\nChủ nhật: 9:00 - 17:00', color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-sm">{item.title}</h3>
                        <p className="text-muted-foreground text-sm whitespace-pre-line mt-0.5">{item.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mạng xã hội */}
              <div className="pt-6 border-t border-border">
                <h3 className="font-bold text-foreground mb-3">Theo dõi chúng tôi</h3>
                <div className="flex gap-3">
                  {['Facebook', 'Instagram', 'TikTok', 'Zalo'].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="px-4 py-2 bg-white border border-border rounded-lg text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form liên hệ */}
            <div className="lg:col-span-3">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  Gửi tin nhắn
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong vòng 24h.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Họ và tên *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Số điện thoại</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                        placeholder="0123 456 789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Chủ đề *</label>
                      <select
                        required
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      >
                        <option value="">-- Chọn chủ đề --</option>
                        <option value="order">Hỏi về đơn hàng</option>
                        <option value="product">Hỏi về sản phẩm</option>
                        <option value="shipping">Giao hàng & vận chuyển</option>
                        <option value="complaint">Khiếu nại / Đổi trả</option>
                        <option value="partnership">Hợp tác kinh doanh</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Nội dung tin nhắn *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                      placeholder="Nội dung bạn muốn gửi..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-70 shadow-md shadow-primary/20"
                  >
                    {sending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Gửi tin nhắn
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-stone-200 h-64 rounded-2xl flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Bản đồ Google Maps</p>
              <p className="text-xs">123 Đường Nông Sản, Quận 1, TP. HCM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
