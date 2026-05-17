'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, ShoppingCart, ImageIcon } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { toast } from 'sonner';

export interface ProductCardData {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  isFeatured: boolean;
  countInStock: number;
  description?: string;
  category?: { name: string } | null;
}

interface ProductCardProps {
  product: ProductCardData;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleItem, isLiked } = useWishlistStore();
  const liked = isLiked(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.countInStock === 0) {
      toast.error('Sản phẩm đã hết hàng');
      return;
    }
    addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0] || '',
      price: product.price,
      qty: 1,
    });
    toast.success('Đã thêm vào giỏ hàng!');
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    if (!liked) {
      toast.success('Đã thêm vào danh sách yêu thích ❤️');
    } else {
      toast('Đã xóa khỏi danh sách yêu thích');
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 h-full flex flex-col">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-2xl m-2 flex-shrink-0">
        <Link href={`/san-pham/${product.slug}`}>
          <div className="relative h-52 bg-stone-100 rounded-xl overflow-hidden">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-amber-50">
                <ImageIcon className="h-14 w-14 text-amber-200" />
              </div>
            )}

            {/* Overlay khi hover */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

            {/* Badge HOT */}
            {product.isFeatured && (
              <div className="absolute top-2 left-2 z-10">
                <span className="bg-primary text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                  🔥 HOT
                </span>
              </div>
            )}

            {/* Badge hết hàng */}
            {product.countInStock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl z-10">
                <span className="bg-white text-foreground text-sm font-bold px-4 py-1.5 rounded-full">
                  Hết hàng
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Action buttons — góc phải trên */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
          {/* Nút yêu thích */}
          <button
            onClick={handleToggleLike}
            className={`w-9 h-9 rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-all duration-200 ${
              liked ? 'bg-red-50' : 'bg-white'
            }`}
            title={liked ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          >
            <Heart
              className={`h-4 w-4 transition-all duration-200 ${
                liked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400'
              }`}
            />
          </button>

          {/* Nút xem nhanh */}
          <Link
            href={`/san-pham/${product.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
            title="Xem chi tiết"
          >
            <Eye className="h-4 w-4 text-gray-400" />
          </Link>
        </div>

        {/* Nút Add — ẩn vì không dùng giỏ hàng */}
        {/* {product.countInStock > 0 && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 z-20 w-12 h-12 bg-primary text-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary/90 hover:scale-110"
            title="Thêm vào giỏ"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        )} */}
      </div>

      {/* Content */}
      <div className="px-4 pb-4 pt-1 flex flex-col flex-1">
        {/* Category tag */}
        {product.category && (
          <span className="text-xs text-secondary font-semibold uppercase tracking-wide">
            {product.category.name}
          </span>
        )}

        {/* Tên sản phẩm — luôn chiếm 2 dòng để đồng đều */}
        <Link href={`/san-pham/${product.slug}`}>
          <h3 className="font-bold text-foreground mt-1 mb-2 line-clamp-2 leading-snug hover:text-primary transition-colors text-[15px] min-h-[2.6em]">
            {product.name}
          </h3>
        </Link>

        {/* Mô tả ngắn — luôn chiếm 2 dòng */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed min-h-[2.5em]">
          {product.description ? `${product.description.substring(0, 80)}...` : '\u00A0'}
        </p>

        {/* Spacer đẩy giá xuống đáy */}
        <div className="flex-1" />

        {/* Giá + nút Đặt mua — luôn ở đáy */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-primary">
            {product.price.toLocaleString('vi-VN')}đ
          </span>

          <Link
            href={`/san-pham/${product.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-semibold text-primary hover:text-white hover:bg-primary border border-primary px-3 py-1.5 rounded-full transition-colors"
          >
            Đặt mua
          </Link>
        </div>
      </div>
    </div>
  );
}
