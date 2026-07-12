'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function NewShipmentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    trackingNumber: '',
    shipper: '',
    consignee: '',
    origin: '',
    destination: '',
    status: 'Pending'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/shipments', {
        ...form,
        timeline: [{
          description: 'Shipment created / Yêu cầu vận chuyển được tạo',
          location: form.origin,
          timestamp: new Date()
        }]
      });
      toast.success('Tạo vận đơn thành công!');
      router.push('/admin/shipments');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tạo vận đơn');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/shipments" className="p-2 hover:bg-white rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Tạo Vận Đơn Mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1.5">Mã Vận Đơn (Tracking Number) *</label>
            <input
              type="text"
              name="trackingNumber"
              required
              value={form.trackingNumber}
              onChange={handleChange}
              placeholder="VD: SPMT123456789"
              className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Người Gửi (Shipper) *</label>
            <input
              type="text"
              name="shipper"
              required
              value={form.shipper}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Người Nhận (Consignee) *</label>
            <input
              type="text"
              name="consignee"
              required
              value={form.consignee}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Điểm Đi (Origin) *</label>
            <input
              type="text"
              name="origin"
              required
              value={form.origin}
              onChange={handleChange}
              placeholder="VD: Ho Chi Minh, VN"
              className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Điểm Đến (Destination) *</label>
            <input
              type="text"
              name="destination"
              required
              value={form.destination}
              onChange={handleChange}
              placeholder="VD: New York, USA"
              className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1.5">Trạng Thái *</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            >
              <option value="Pending">Pending (Chờ xử lý)</option>
              <option value="In Transit">In Transit (Đang vận chuyển)</option>
              <option value="Customs Clearance">Customs Clearance (Đang làm thủ tục HQ)</option>
              <option value="Arrived">Arrived (Đã đến đích)</option>
              <option value="Delivered">Delivered (Đã giao hàng)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Link
            href="/admin/shipments"
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Lưu Vận Đơn
          </button>
        </div>
      </form>
    </div>
  );
}
