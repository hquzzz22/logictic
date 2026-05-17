'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, LogOut, Edit2, Check, X } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Order {
  _id: string;
  orderItems: { name: string; qty: number }[];
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
}

export default function AccountPage() {
  const router = useRouter();
  const { userInfo, setUserInfo, logout } = useUserStore();
  const [hydrated, setHydrated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  // Chờ Zustand hydrate từ localStorage
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!userInfo) {
      router.replace('/login');
      return;
    }
    setName(userInfo.name);
    api.get('/orders/myorders')
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  }, [hydrated, userInfo, router]);

  const handleSaveName = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', { name });
      setUserInfo(data);
      setEditing(false);
      toast.success('Đã cập nhật tên');
    } catch {
      toast.error('Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!hydrated || !userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-muted/10 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Tài Khoản Của Tôi</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <User className="h-10 w-10 text-primary" />
                </div>
                {editing ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-center"
                    />
                    <button onClick={handleSaveName} disabled={saving} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => { setEditing(false); setName(userInfo.name); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-foreground">{userInfo.name}</h2>
                    <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-primary transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-1">{userInfo.email}</p>
                {userInfo.isAdmin && (
                  <span className="mt-2 inline-flex px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">
                    Admin
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {userInfo.isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-primary bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Quản trị Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Đơn hàng của tôi
                </h3>
              </div>

              {loadingOrders ? (
                <div className="flex items-center justify-center h-40">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Bạn chưa có đơn hàng nào</p>
                  <Link href="/san-pham" className="inline-flex items-center mt-4 text-primary font-medium hover:underline text-sm">
                    Mua sắm ngay →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {orders.map((order) => (
                    <div key={order._id} className="p-5 hover:bg-muted/20 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-mono font-bold text-primary">
                            #{order._id.slice(-8).toUpperCase()}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {order.orderItems.map(i => `${i.name} x${i.qty}`).join(', ').substring(0, 60)}
                            {order.orderItems.length > 1 ? '...' : ''}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(order.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-foreground">{order.totalPrice.toLocaleString('vi-VN')}đ</div>
                          <div className="flex gap-1 mt-1 justify-end">
                            <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {order.isPaid ? 'Đã TT' : 'Chưa TT'}
                            </span>
                            <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                              {order.isDelivered ? 'Đã giao' : 'Chờ giao'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
