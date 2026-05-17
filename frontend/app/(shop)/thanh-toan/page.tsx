'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { ChevronRight, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCartStore();
  const userInfo = useUserStore((state) => state.userInfo);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: userInfo?.name || '',
    phone: '',
    address: '',
    city: 'Hồ Chí Minh',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isProcessing, setIsProcessing] = useState(false);

  if (cartItems.length === 0) {
    if (typeof window !== 'undefined') {
      router.push('/gio-hang');
    }
    return null;
  }

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 500000 ? 0 : 30000;
  const totalPrice = itemsPrice + shippingPrice;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.product,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
      };

      const { data } = await api.post('/orders', orderData);

      clearCart();
      toast.success('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
      router.push(`/dat-hang-thanh-cong?orderId=${data._id}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-muted/10 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center text-sm text-muted-foreground mb-8">
          <Link href="/gio-hang" className="hover:text-primary transition-colors">Giỏ hàng</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground font-medium">Thanh toán</span>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-8">Thanh Toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Checkout */}
          <div className="lg:col-span-7 space-y-6">
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-border">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
                <Truck className="h-5 w-5 mr-2 text-primary" />
                Thông tin giao hàng
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">Tỉnh / Thành phố *</label>
                <select
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                >
                  <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Other">Tỉnh thành khác</option>
                </select>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-foreground mb-2">Địa chỉ cụ thể *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện"
                />
              </div>

              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center pt-6 border-t border-border">
                <CreditCard className="h-5 w-5 mr-2 text-primary" />
                Phương thức thanh toán
              </h2>

              <div className="space-y-4">
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <div className="ml-4">
                    <span className="block text-sm font-bold text-foreground">Thanh toán khi nhận hàng (COD)</span>
                    <span className="block text-sm text-muted-foreground mt-1">Khách hàng thanh toán bằng tiền mặt cho người giao hàng.</span>
                  </div>
                </label>

                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'Chuyển khoản' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Chuyển khoản"
                    checked={paymentMethod === 'Chuyển khoản'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <div className="ml-4">
                    <span className="block text-sm font-bold text-foreground">Chuyển khoản ngân hàng</span>
                    <span className="block text-sm text-muted-foreground mt-1">Thông tin chuyển khoản sẽ hiển thị sau khi hoàn tất đơn hàng.</span>
                  </div>
                </label>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-border sticky top-24">
              <h3 className="text-xl font-bold text-foreground mb-6">Tóm tắt đơn hàng</h3>

              <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 pr-2">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center py-2">
                    <div className="relative w-16 h-16 bg-stone-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic">Ảnh</span>
                      )}
                      <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                        {item.qty}
                      </span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium text-foreground line-clamp-2">{item.name}</h4>
                    </div>
                    <div className="ml-4 text-sm font-bold text-foreground">
                      {(item.price * item.qty).toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 mb-4 space-y-3">
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Tạm tính</span>
                  <span className="text-foreground font-medium">{itemsPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Phí giao hàng</span>
                  <span className="text-foreground font-medium">
                    {shippingPrice === 0 ? (
                      <span className="text-green-600 font-semibold">Miễn phí</span>
                    ) : (
                      `${shippingPrice.toLocaleString('vi-VN')}đ`
                    )}
                  </span>
                </div>
                {shippingPrice > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Mua thêm {(500000 - itemsPrice).toLocaleString('vi-VN')}đ để được miễn phí giao hàng
                  </p>
                )}
              </div>

              <div className="border-t border-border pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">Tổng cộng</span>
                  <span className="text-3xl font-bold text-primary">{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full flex justify-center items-center py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  'Hoàn Tất Đặt Hàng'
                )}
              </button>

              <div className="mt-6 flex items-center justify-center text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4 mr-1" />
                <span>Thông tin của bạn được bảo mật an toàn 100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
