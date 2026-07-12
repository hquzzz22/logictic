'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Clock, MapPin, Trash2 } from 'lucide-react';
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
      await api.put(`/shipments/${id}`, {
        shipper: shipment.shipper,
        consignee: shipment.consignee,
        origin: shipment.origin,
        destination: shipment.destination,
        status: shipment.status
      });
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

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/shipments" className="p-2 hover:bg-white rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            Chi Tiết Vận Đơn: <span className="text-primary">{shipment.trackingNumber}</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Update Basic Info Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleUpdate} className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-6">
            <h2 className="text-lg font-bold border-b border-border pb-4 mb-4">Thông Tin Vận Đơn</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Người Gửi (Shipper)</label>
                <input
                  type="text"
                  value={shipment.shipper}
                  onChange={e => setShipment({...shipment, shipper: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Người Nhận (Consignee)</label>
                <input
                  type="text"
                  value={shipment.consignee}
                  onChange={e => setShipment({...shipment, consignee: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Điểm Đi (Origin)</label>
                <input
                  type="text"
                  value={shipment.origin}
                  onChange={e => setShipment({...shipment, origin: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Điểm Đến (Destination)</label>
                <input
                  type="text"
                  value={shipment.destination}
                  onChange={e => setShipment({...shipment, destination: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Trạng Thái</label>
                <select
                  value={shipment.status}
                  onChange={e => setShipment({...shipment, status: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white font-bold text-primary"
                >
                  <option value="Pending">Pending (Chờ xử lý)</option>
                  <option value="In Transit">In Transit (Đang vận chuyển)</option>
                  <option value="Customs Clearance">Customs Clearance (Đang làm thủ tục HQ)</option>
                  <option value="Arrived">Arrived (Đã đến đích)</option>
                  <option value="Delivered">Delivered (Đã giao hàng)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
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
                Cập Nhật
              </button>
            </div>
          </form>

          {/* Add Timeline Event Form */}
          <form onSubmit={handleAddTimelineEvent} className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-4 bg-[#fff0ef]/50">
            <h2 className="text-lg font-bold text-foreground">Thêm Sự Kiện Hành Trình</h2>
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

        {/* Timeline View */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 sticky top-6">
            <h2 className="text-lg font-bold text-foreground mb-6">Lịch Sử Hành Trình</h2>
            <div className="relative border-l border-muted-foreground/30 ml-3 space-y-6">
              {[...shipment.timeline].reverse().map((event: any, index: number) => (
                <div key={event._id || index} className="relative pl-6">
                  <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-white" />
                  <div className="flex flex-col">
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
