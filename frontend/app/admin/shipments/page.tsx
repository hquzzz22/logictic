'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Plus, Search, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Shipment {
  _id: string;
  trackingNumber: string;
  shipper: string;
  consignee: string;
  status: string;
  origin: string;
  destination: string;
  createdAt: string;
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchShipments = async () => {
    try {
      const { data } = await api.get('/shipments');
      setShipments(data);
    } catch (error) {
      toast.error('Lỗi tải danh sách vận đơn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa vận đơn này?')) return;
    try {
      await api.delete(`/shipments/${id}`);
      setShipments(shipments.filter(s => s._id !== id));
      toast.success('Đã xóa vận đơn');
    } catch (error) {
      toast.error('Lỗi khi xóa vận đơn');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Transit': return 'bg-[#ffe4e2] text-brand-800';
      case 'Customs Clearance': return 'bg-purple-100 text-purple-800';
      case 'Arrived': return 'bg-indigo-100 text-indigo-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredShipments = shipments.filter(s => 
    s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.shipper.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.consignee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          Quản lý Vận đơn
        </h1>
        <Link
          href="/admin/shipments/new"
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm text-sm font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo Vận Đơn Mới
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm mã vận đơn, người gửi, người nhận..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>Không tìm thấy vận đơn nào.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Mã Vận Đơn</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Người Gửi</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Người Nhận</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Tuyến Đường</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Trạng Thái</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Ngày Tạo</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredShipments.map((shipment) => (
                  <tr key={shipment._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 text-sm font-bold text-foreground">
                      {shipment.trackingNumber}
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">
                      {shipment.shipper}
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">
                      {shipment.consignee}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {shipment.origin} <br/> ↓ <br/> {shipment.destination}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {new Date(shipment.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/shipments/${shipment._id}`}
                          className="p-1.5 text-[#e62c26] hover:bg-[#fff0ef] rounded transition-colors"
                          title="Sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(shipment._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
