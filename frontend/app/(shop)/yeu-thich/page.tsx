'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import ProductCard from '@/components/shop/ProductCard';
import { toast } from 'sonner';

export default function WishlistPage() {
  const { items, removeItem, clearAll } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleAddAllToCart = () => {
    const inStock = items.filter((p) => p.countInStock > 0);
    if (inStock.length === 0) {
      toast.error('Tất cả sản phẩm đều hết hàng');
      return;
    }
    inStock.forEach((product) => {
      addToCart({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: product.price,
        qty: 1,
      });
    });
    toast.success(`Đã thêm ${inStock.length} sản phẩm vào giỏ hàng!`);
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-muted/10 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Heart className="h-8 w-8 fill-red-500 text-red-500" />
              Sản Phẩm Yêu Thích
            </h1>
            <p className="text-muted-foreground mt-1">
              {items.length > 0
                ? `${items.length} sản phẩm trong danh sách yêu thích`
                : 'Danh sách yêu thích trống'}
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddAllToCart}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 text-sm"
              >
                <ShoppingCart className="h-4 w-4" />
                Thêm tất cả vào giỏ
              </button>
              <button
                onClick={() => {
                  if (confirm('Xóa tất cả sản phẩm yêu thích?')) clearAll();
                }}
                className="flex items-center gap-2 px-4 py-2.5 border border-border text-muted-foreground font-medium rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors text-sm"
              >
                <Trash2 className="h-4 w-4" />
                Xóa tất cả
              </button>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl shadow-sm border border-border p-16 text-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-red-300" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Chưa có sản phẩm yêu thích
            </h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Nhấn vào icon ❤️ trên sản phẩm để lưu vào danh sách yêu thích của bạn.
            </p>
            <Link
              href="/san-pham"
              className="inline-flex items-center px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
            >
              Khám phá sản phẩm
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((product) => (
                <div key={product._id} className="relative">
                  <ProductCard product={product} />
                  {/* Nút xóa riêng */}
                  <button
                    onClick={() => {
                      removeItem(product._id);
                      toast('Đã xóa khỏi danh sách yêu thích');
                    }}
                    className="absolute top-4 left-4 z-30 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors text-muted-foreground"
                    title="Xóa khỏi yêu thích"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 text-center">
              <Link
                href="/san-pham"
                className="inline-flex items-center text-primary font-semibold hover:underline"
              >
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
