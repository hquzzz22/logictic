'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Truck, Package } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Order {
  _id: string;
  user?: { name: string; email: string };
  shippingAddress: { fullName: string; phone: string; address: string; city: string };
  orderItems: { _id: string; name: string; qty: number; price: number; image: string; product: string };
  totalPrice: number;
  itemsPrice: number;
  shippingPrice: number;
  paymentMethod: string;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${params.id}`);
        setOrder(data);
      } catch {
        toast.error('Không tìm thấy đơn hàng');
        router.push('/admin/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params.id, router]);

  const handleMarkPaid = async () => {
    try {
      const { data } = await api.put(`/orders/${order?._id}/pay`);
      setOrder(data);
      toast.success('Đã đánh dấu thanh toán');
    } catch {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleMarkDelivered = async () => {
    try {
      const { data } = await api.put(`/orders/${order?._id}/deliver`);
      setOrder(data);
      toast.success('Đã đánh dấu giao hàng');
    } catch {
      toast.error('Có lỗi xảy ra');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Quay lại
        </Link>
        <h1 className="text-2xl font-bold text-foreground">
          Đơn hàng #{order._id.slice(-8).toUpperCase()}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order Items + Shipping */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sản phẩm */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-primary" />
              Sản phẩm đặt hàng
            </h2>
            <div className="space-y-3">
              {(order.orderItems as unknown as { _id: string; name: string; qty: number; price: number; image: string; product: string }[]).map((item) => (
                <div key={item._id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                      Ảnh
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.name}</div>
                      <div className="text-xs text-muted-foreground">x{item.qty}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {(item.price * item.qty).toLocaleString('vi-VN')}đ
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thông tin giao hàng */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-primary" />
              Thông tin giao hàng
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Người nhận:</span>
                <span className="font-medium text-foreground">{order.shippingAddress.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số điện thoại:</span>
                <span className="font-medium text-foreground">{order.shippingAddress.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Địa chỉ:</span>
                <span className="font-medium text-foreground text-right max-w-xs">
                  {order.shippingAddress.address}, {order.shippingAddress.city}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phương thức:</span>
                <span className="font-medium text-foreground">{order.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary + Actions */}
        <div className="space-y-6">
          {/* Tóm tắt */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Tạm tính</span>
                <span>{order.itemsPrice.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Phí giao hàng</span>
                <span>{order.shippingPrice === 0 ? 'Miễn phí' : `${order.shippingPrice.toLocaleString('vi-VN')}đ`}</span>
              </div>
              <div className="flex justify-between font-bold text-foreground border-t pt-3">
                <span>Tổng cộng</span>
                <span className="text-primary text-lg">{order.totalPrice.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>

          {/* Trạng thái */}
          <div className="bg-white rounded-lg border shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Trạng thái</h2>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Thanh toán</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {order.isPaid ? `Đã thanh toán ${order.paidAt ? new Date(order.paidAt).toLocaleDateString('vi-VN') : ''}` : 'Chưa thanh toán'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Giao hàng</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {order.isDelivered ? `Đã giao ${order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString('vi-VN') : ''}` : 'Chờ giao'}
              </span>
            </div>

            <div className="space-y-2 pt-2">
              {!order.isPaid && (
                <button
                  onClick={handleMarkPaid}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Đánh dấu đã thanh toán
                </button>
              )}
              {!order.isDelivered && (
                <button
                  onClick={handleMarkDelivered}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Đánh dấu đã giao hàng
                </button>
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Đặt lúc: {new Date(order.createdAt).toLocaleString('vi-VN')}
          </div>
        </div>
      </div>
    </div>
  );
}
