'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ImageIcon } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function CartPage() {
  const { cartItems, addToCart, removeFromCart } = useCartStore();

  const updateQty = (item: typeof cartItems[0], qty: number) => {
    if (qty > 0) {
      addToCart({ ...item, qty });
    }
  };

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = cartItems.length > 0 && itemsPrice > 500000 ? 0 : cartItems.length > 0 ? 30000 : 0;
  const totalPrice = itemsPrice + shippingPrice;
  const totalQty = cartItems.reduce((a, c) => a + c.qty, 0);

  return (
    <div className="bg-muted/10 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">Giỏ Hàng Của Bạn</h1>
        <p className="text-muted-foreground mb-8">
          {totalQty > 0 ? `${totalQty} sản phẩm trong giỏ hàng` : 'Giỏ hàng trống'}
        </p>

        {cartItems.length === 0 ? (
          <div className="bg-white p-16 text-center rounded-2xl shadow-sm border border-border">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground opacity-40" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">Giỏ hàng trống</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Bạn chưa thêm sản phẩm nào. Hãy khám phá các sản phẩm ngon của chúng tôi!
            </p>
            <Link
              href="/san-pham"
              className="inline-flex items-center px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
            >
              Mua sắm ngay
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-border"
                >
                  {/* Image */}
                  <div className="w-24 h-24 bg-stone-100 rounded-xl flex-shrink-0 overflow-hidden relative">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-stone-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <Link
                      href={`/san-pham/${item.product}`}
                      className="text-base font-bold text-foreground hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <div className="text-primary font-bold mt-1 text-lg">
                      {item.price.toLocaleString('vi-VN')}đ
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      Thành tiền: <span className="font-semibold text-foreground">{(item.price * item.qty).toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>

                  {/* Qty + Delete */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-border rounded-xl bg-white h-11 overflow-hidden">
                      <button
                        onClick={() => updateQty(item, item.qty - 1)}
                        className="px-3 h-full text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-foreground text-sm">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item, item.qty + 1)}
                        className="px-3 h-full text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product)}
                      className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Xóa khỏi giỏ"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}

              <Link
                href="/san-pham"
                className="inline-flex items-center text-sm text-primary font-medium hover:underline mt-2"
              >
                ← Tiếp tục mua sắm
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-border sticky top-24">
                <h3 className="text-xl font-bold text-foreground mb-6 pb-4 border-b border-border">
                  Tổng Đơn Hàng
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tạm tính ({totalQty} sản phẩm)</span>
                    <span className="text-foreground font-medium">{itemsPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Phí giao hàng</span>
                    <span className="font-medium">
                      {shippingPrice === 0 ? (
                        <span className="text-green-600 font-semibold">Miễn phí</span>
                      ) : (
                        <span className="text-foreground">{shippingPrice.toLocaleString('vi-VN')}đ</span>
                      )}
                    </span>
                  </div>
                  {shippingPrice > 0 && (
                    <div className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                      🚚 Mua thêm <strong>{(500000 - itemsPrice).toLocaleString('vi-VN')}đ</strong> để được miễn phí giao hàng
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-foreground">Tổng cộng</span>
                    <span className="text-2xl font-bold text-primary">{totalPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-right mt-1">(Đã bao gồm VAT)</p>
                </div>

                <Link
                  href="/thanh-toan"
                  className="w-full flex justify-center items-center py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 text-base"
                >
                  Tiến Hành Thanh Toán
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>

                {/* Trust badges */}
                <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-xl mb-1">🔒</div>
                    <div className="text-xs text-muted-foreground">Thanh toán an toàn</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl mb-1">🚚</div>
                    <div className="text-xs text-muted-foreground">Giao hàng toàn quốc</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl mb-1">↩️</div>
                    <div className="text-xs text-muted-foreground">Đổi trả dễ dàng</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl mb-1">⭐</div>
                    <div className="text-xs text-muted-foreground">Chất lượng đảm bảo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
