'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Eye, CheckCircle, Truck } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Order {
  _id: string;
  user?: { name: string; email: string };
  shippingAddress: { fullName: string; phone: string; address: string; city: string };
  orderItems: { name: string; qty: number; price: number }[];
  totalPrice: number;
  paymentMethod: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'delivered'>('all');

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch {
      toast.error('Không thể tải đơn hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleMarkPaid = async (id: string) => {
    try {
      await api.put(`/orders/${id}/pay`);
      toast.success('Đã đánh dấu thanh toán');
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, isPaid: true } : o)));
    } catch {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleMarkDelivered = async (id: string) => {
    try {
      await api.put(`/orders/${id}/deliver`);
      toast.success('Đã đánh dấu giao hàng');
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, isDelivered: true } : o)));
    } catch {
      toast.error('Có lỗi xảy ra');
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase()) ||
      o._id.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      (filter === 'pending' && !o.isDelivered) ||
      (filter === 'delivered' && o.isDelivered);
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Đơn hàng ({orders.length})</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc mã đơn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-border rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'delivered'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-white border border-border text-muted-foreground hover:bg-muted'}`}
            >
              {f === 'all' ? 'Tất cả' : f === 'pending' ? 'Chờ giao' : 'Đã giao'}
            </button>
          ))}
        </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Mã đơn</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Tổng tiền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Thanh toán</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Giao hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Ngày đặt</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      Không có đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => (
                    <tr key={order._id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-primary font-medium">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-foreground">{order.shippingAddress.fullName}</div>
                        <div className="text-xs text-muted-foreground">{order.shippingAddress.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">
                        {order.totalPrice.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {order.isDelivered ? 'Đã giao' : 'Chờ giao'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="inline-flex items-center px-2 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          {!order.isPaid && (
                            <button
                              onClick={() => handleMarkPaid(order._id)}
                              className="inline-flex items-center px-2 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                              title="Đánh dấu đã thanh toán"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {!order.isDelivered && (
                            <button
                              onClick={() => handleMarkDelivered(order._id)}
                              className="inline-flex items-center px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                              title="Đánh dấu đã giao hàng"
                            >
                              <Truck className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
