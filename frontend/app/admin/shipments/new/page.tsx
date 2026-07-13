'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, User, Package, DollarSign, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function NewShipmentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    trackingNumber: '',
    shipper: { name: '', phone: '', address: '' },
    consignee: { name: '', phone: '', address: '' },
    origin: '',
    destination: '',
    status: 'Pending',
    packages: '',
    weight: '',
    goodsDescription: '',
    totalAmount: ''
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

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (type: 'shipper' | 'consignee', field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/shipments" className="p-2 hover:bg-white rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Tạo Vận Đơn Mới (Pro)</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-3">
            <Package className="h-5 w-5 text-primary" />
            Thông Tin Chung
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-foreground mb-1.5">Mã Vận Đơn (Tracking Number) *</label>
              <input
                type="text"
                name="trackingNumber"
                required
                value={form.trackingNumber}
                onChange={handleBasicChange}
                placeholder="VD: SPMT123456789"
                className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase font-black tracking-widest bg-stone-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Trạng Thái *</label>
              <select
                name="status"
                value={form.status}
                onChange={handleBasicChange}
                className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white font-bold text-primary"
              >
                <option value="Pending">Pending (Chờ xử lý)</option>
                <option value="In Transit">In Transit (Đang vận chuyển)</option>
                <option value="Customs Clearance">Customs Clearance (Đang làm thủ tục HQ)</option>
                <option value="Arrived">Arrived (Đã đến đích)</option>
                <option value="Delivered">Delivered (Đã giao hàng)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Điểm Đi (Origin) *</label>
              <input type="text" name="origin" required value={form.origin} onChange={handleBasicChange} placeholder="VD: Ho Chi Minh, VN" className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Điểm Đến (Destination) *</label>
              <input type="text" name="destination" required value={form.destination} onChange={handleBasicChange} placeholder="VD: New York, USA" className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
        </div>

        {/* Row 2: Parties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipper */}
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-3">
              <User className="h-5 w-5 text-blue-500" />
              Người Gửi (Shipper)
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Tên người gửi / Công ty *</label>
                <input type="text" required value={form.shipper.name} onChange={(e) => handleNestedChange('shipper', 'name', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Số điện thoại</label>
                <input type="text" value={form.shipper.phone} onChange={(e) => handleNestedChange('shipper', 'phone', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Địa chỉ</label>
                <input type="text" value={form.shipper.address} onChange={(e) => handleNestedChange('shipper', 'address', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </div>

          {/* Consignee */}
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-3">
              <User className="h-5 w-5 text-green-500" />
              Người Nhận (Consignee)
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Tên người nhận / Công ty *</label>
                <input type="text" required value={form.consignee.name} onChange={(e) => handleNestedChange('consignee', 'name', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Số điện thoại</label>
                <input type="text" value={form.consignee.phone} onChange={(e) => handleNestedChange('consignee', 'phone', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Địa chỉ</label>
                <input type="text" value={form.consignee.address} onChange={(e) => handleNestedChange('consignee', 'address', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Cargo & Financial */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-3">
            <DollarSign className="h-5 w-5 text-yellow-500" />
            Chi tiết Hàng hóa & Cước phí
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1.5">Mô tả hàng hóa (Goods Description)</label>
              <input type="text" name="goodsDescription" value={form.goodsDescription} onChange={handleBasicChange} placeholder="VD: Laptop, Áo quần..." className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Số lượng kiện (Packages)</label>
              <input type="text" name="packages" value={form.packages} onChange={handleBasicChange} placeholder="VD: 5 cartons" className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Trọng lượng (Weight)</label>
              <input type="text" name="weight" value={form.weight} onChange={handleBasicChange} placeholder="VD: 150 kg" className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="md:col-span-2 md:col-start-1">
              <label className="block text-sm font-bold text-foreground mb-1.5">Cước phí (Total Amount)</label>
              <input type="text" name="totalAmount" value={form.totalAmount} onChange={handleBasicChange} placeholder="VD: 2,500,000 VND" className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-red-600" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/admin/shipments"
            className="px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-white rounded-lg border border-border hover:bg-stone-50"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-8 py-3 bg-[#e62c26] text-white text-sm font-bold rounded-lg hover:bg-[#e62c26]/90 transition-colors disabled:opacity-50"
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
