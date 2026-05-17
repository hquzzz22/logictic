'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Users, DollarSign, ShoppingBag, TrendingUp, Clock } from 'lucide-react';
import api from '@/lib/api';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalUsers: number;
}

interface Order {
  _id: string;
  shippingAddress: { fullName: string };
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderStatsRes, ordersRes, productsRes, usersRes] = await Promise.all([
          api.get('/orders/stats'),
          api.get('/orders'),
          api.get('/products'),
          api.get('/users'),
        ]);

        setStats({
          totalRevenue: orderStatsRes.data.totalRevenue,
          totalOrders: orderStatsRes.data.totalOrders,
          pendingOrders: orderStatsRes.data.pendingOrders,
          totalProducts: productsRes.data.length,
          totalUsers: usersRes.data.length,
        });

        setRecentOrders(ordersRes.data.slice(0, 5));
      } catch (err) {
        console.error('Lỗi tải dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      name: 'Tổng doanh thu',
      value: stats.totalRevenue.toLocaleString('vi-VN') + 'đ',
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-100',
      href: '/admin/orders',
    },
    {
      name: 'Tổng đơn hàng',
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      href: '/admin/orders',
    },
    {
      name: 'Chờ giao hàng',
      value: stats.pendingOrders.toString(),
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      href: '/admin/orders',
    },
    {
      name: 'Sản phẩm',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      href: '/admin/products',
    },
    {
      name: 'Khách hàng',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'text-pink-600',
      bg: 'bg-pink-100',
      href: '/admin/users',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="bg-white overflow-hidden shadow-sm rounded-lg border hover:shadow-md transition-shadow"
            >
              <div className="p-5 flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${item.bg}`}>
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dt className="text-xs font-medium text-muted-foreground truncate">{item.name}</dt>
                  <dd className="text-xl font-bold text-foreground mt-1">{item.value}</dd>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow-sm rounded-lg border">
        <div className="p-6 flex items-center justify-between border-b">
          <h2 className="text-lg font-semibold text-foreground flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Đơn hàng gần đây
          </h2>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline font-medium">
            Xem tất cả
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Chưa có đơn hàng nào
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Mã đơn</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Tổng tiền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Thanh toán</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Giao hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Ngày đặt</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-primary">
                      <Link href={`/admin/orders/${order._id}`} className="hover:underline">
                        #{order._id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{order.shippingAddress.fullName}</td>
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
