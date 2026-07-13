'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Clock, MapPin, Trash2, Package, User, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function EditShipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shipment, setShipment] = useState<any>(null);
  
  const [timelineEvent, setTimelineEvent] = useState({
    description: '',
    location: '',
    timestamp: new Date().toISOString().slice(0, 16)
  });

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const { data } = await api.get(`/shipments/${id}`);
        // Ensure nested objects exist to avoid crashes if old data
        if (!data.shipper || typeof data.shipper === 'string') data.shipper = { name: data.shipper || '', phone: '', address: '' };
        if (!data.consignee || typeof data.consignee === 'string') data.consignee = { name: data.consignee || '', phone: '', address: '' };
        setShipment(data);
      } catch (error) {
        toast.error('Không tìm thấy vận đơn');
        router.push('/admin/shipments');
      } finally {
        setLoading(false);
      }
    };
    fetchShipment();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put(`/shipments/${id}`, {
        shipper: shipment.shipper,
        consignee: shipment.consignee,
        origin: shipment.origin,
        destination: shipment.destination,
        status: shipment.status,
        packages: shipment.packages,
        weight: shipment.weight,
        goodsDescription: shipment.goodsDescription,
        totalAmount: shipment.totalAmount
      });
      setShipment(data);
      toast.success('Cập nhật vận đơn thành công!');
    } catch (error) {
      toast.error('Lỗi khi cập nhật vận đơn');
    } finally {
      setSaving(false);
    }
  };

  const handleAddTimelineEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timelineEvent.description) return;
    
    try {
      const { data } = await api.post(`/shipments/${id}/timeline`, {
        description: timelineEvent.description,
        location: timelineEvent.location,
        timestamp: new Date(timelineEvent.timestamp).toISOString()
      });
      setShipment(data);
      toast.success('Đã thêm sự kiện hành trình');
      setTimelineEvent({
        description: '',
        location: '',
        timestamp: new Date().toISOString().slice(0, 16)
      });
    } catch (error) {
      toast.error('Lỗi khi thêm sự kiện');
    }
  };

  const handleDeleteTimelineEvent = async (eventId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) return;
    try {
      const { data } = await api.delete(`/shipments/${id}/timeline/${eventId}`);
      setShipment(data);
      toast.success('Đã xóa sự kiện');
    } catch (error) {
      toast.error('Lỗi khi xóa sự kiện');
    }
  };

  const handleNestedChange = (type: 'shipper' | 'consignee', field: string, value: string) => {
    setShipment((prev: any) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/shipments" className="p-2 hover:bg-white rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            Sửa Vận Đơn: <span className="text-primary">{shipment.trackingNumber}</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleUpdate} className="space-y-6">
            
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-3">
                <Package className="h-5 w-5 text-primary" />
                Thông Tin Chung
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Trạng Thái *</label>
                  <select
                    value={shipment.status}
                    onChange={e => setShipment({...shipment, status: e.target.value})}
                    className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-stone-50 font-bold text-primary"
                  >
                    <option value="Pending">Pending (Chờ xử lý)</option>
                    <option value="In Transit">In Transit (Đang vận chuyển)</option>
                    <option value="Customs Clearance">Customs Clearance (Đang làm thủ tục HQ)</option>
                    <option value="Arrived">Arrived (Đã đến đích)</option>
                    <option value="Delivered">Delivered (Đã giao hàng)</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-2">Đổi trạng thái sẽ tự động ghi log vào Timeline.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Điểm Đi (Origin)</label>
                  <input type="text" value={shipment.origin} onChange={e => setShipment({...shipment, origin: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Điểm Đến (Destination)</label>
                  <input type="text" value={shipment.destination} onChange={e => setShipment({...shipment, destination: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            </div>

            {/* Parties */}
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
                    <input type="text" required value={shipment.shipper.name} onChange={(e) => handleNestedChange('shipper', 'name', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Số điện thoại</label>
                    <input type="text" value={shipment.shipper.phone} onChange={(e) => handleNestedChange('shipper', 'phone', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Địa chỉ</label>
                    <input type="text" value={shipment.shipper.address} onChange={(e) => handleNestedChange('shipper', 'address', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
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
                    <input type="text" required value={shipment.consignee.name} onChange={(e) => handleNestedChange('consignee', 'name', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Số điện thoại</label>
                    <input type="text" value={shipment.consignee.phone} onChange={(e) => handleNestedChange('consignee', 'phone', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Địa chỉ</label>
                    <input type="text" value={shipment.consignee.address} onChange={(e) => handleNestedChange('consignee', 'address', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Cargo & Financial */}
            <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-3">
                <DollarSign className="h-5 w-5 text-yellow-500" />
                Chi tiết Hàng hóa & Cước phí
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Mô tả hàng hóa (Goods Description)</label>
                  <input type="text" value={shipment.goodsDescription} onChange={e => setShipment({...shipment, goodsDescription: e.target.value})} placeholder="VD: Laptop, Áo quần..." className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Số lượng kiện (Packages)</label>
                  <input type="text" value={shipment.packages} onChange={e => setShipment({...shipment, packages: e.target.value})} placeholder="VD: 5 cartons" className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Trọng lượng (Weight)</label>
                  <input type="text" value={shipment.weight} onChange={e => setShipment({...shipment, weight: e.target.value})} placeholder="VD: 150 kg" className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-foreground mb-1.5">Cước phí (Total Amount)</label>
                  <input type="text" value={shipment.totalAmount} onChange={e => setShipment({...shipment, totalAmount: e.target.value})} placeholder="VD: 2,500,000 VND" className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-red-600" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-8 py-3 bg-[#e62c26] text-white text-sm font-bold rounded-lg hover:bg-[#e62c26]/90 transition-colors disabled:opacity-50 w-full md:w-auto justify-center"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Cập Nhật Vận Đơn
              </button>
            </div>
          </form>

          {/* Add Timeline Event Form */}
          <form onSubmit={handleAddTimelineEvent} className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-4 bg-[#fff0ef]/50 mt-6">
            <h2 className="text-lg font-bold text-foreground">Thêm Sự Kiện Hành Trình (Thủ công)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-foreground mb-1">Mô tả sự kiện *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Hàng đã đến cảng Cát Lái..."
                  value={timelineEvent.description}
                  onChange={e => setTimelineEvent({...timelineEvent, description: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Địa điểm</label>
                <input
                  type="text"
                  placeholder="VD: Ho Chi Minh, VN"
                  value={timelineEvent.location}
                  onChange={e => setTimelineEvent({...timelineEvent, location: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Thời gian</label>
                <input
                  type="datetime-local"
                  value={timelineEvent.timestamp}
                  onChange={e => setTimelineEvent({...timelineEvent, timestamp: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-stone-900 text-white text-sm font-bold rounded-lg hover:bg-stone-800 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm Sự Kiện
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Timeline View */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 sticky top-6">
            <h2 className="text-lg font-bold text-foreground mb-6">Lịch Sử Hành Trình</h2>
            <div className="relative border-l border-muted-foreground/30 ml-3 space-y-6">
              {[...shipment.timeline].reverse().map((event: any, index: number) => (
                <div key={event._id || index} className="relative pl-6 group">
                  <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-white" />
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-bold text-foreground mb-0.5">{event.description}</span>
                    {event.location && (
                      <span className="text-xs text-muted-foreground flex items-center mb-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </span>
                    )}
                    <span className="text-xs text-primary font-medium flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(event.timestamp).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTimelineEvent(event._id)}
                    className="absolute top-0 right-0 p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="Xóa sự kiện"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
