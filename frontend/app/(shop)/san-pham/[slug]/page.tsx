'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Star, Minus, Plus, ShoppingCart, Check, Truck, Shield, ImageIcon, ArrowLeft, Phone } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUserStore } from '@/store/userStore';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  shortDescription: string;
  description: string;
  images: string[];
  countInStock: number;
  isFeatured: boolean;
  category: { _id: string; name: string; slug: string } | null;
}

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [contactButtons, setContactButtons] = useState<any>(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleItem, isLiked } = useWishlistStore();

  // Wishlist helpers
  const isInWishlist = product ? isLiked(product._id) : false;
  const toggleWishlist = () => {
    if (!product) return;
    toggleItem(product);
  };

  // Fake view count — tạo số ngẫu nhiên 20-50, thay đổi nhẹ mỗi vài giây
  useEffect(() => {
    const baseView = 20 + Math.floor(Math.random() * 30); // 20-50
    setViewCount(baseView);
    const interval = setInterval(() => {
      setViewCount((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const next = prev + change;
        return Math.max(15, Math.min(55, next)); // giữ trong khoảng 15-55
      });
    }, 3000 + Math.random() * 4000); // mỗi 3-7 giây
    return () => clearInterval(interval);
  }, []);

  // Share
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product?.name, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Đã sao chép link sản phẩm!');
    }
  };

  // Like toggle
  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => liked ? prev - 1 : prev + 1);
    toast(liked ? 'Đã bỏ thích' : 'Đã thích sản phẩm 👍');
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [productRes, settingsRes] = await Promise.all([
          api.get(`/products/slug/${params.slug}`),
          api.get('/settings/contactButtons'),
        ]);
        setProduct(productRes.data);
        if (settingsRes.data) setContactButtons(settingsRes.data);
      } catch {
        toast.error('Không tìm thấy sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.slug]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.countInStock === 0) {
      toast.error('Sản phẩm đã hết hàng');
      return;
    }
    addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0] || '',
      price: product.price,
      qty,
    });
    toast.success(`Đã thêm ${qty} sản phẩm vào giỏ hàng!`);
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-stone-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-stone-200 rounded w-3/4" />
              <div className="h-4 bg-stone-200 rounded w-1/2" />
              <div className="h-10 bg-stone-200 rounded w-1/3" />
              <div className="h-24 bg-stone-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Không tìm thấy sản phẩm</h2>
          <Link href="/san-pham" className="text-primary hover:underline">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-muted-foreground mb-8 gap-2">
          <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href="/san-pham" className="hover:text-primary transition-colors">Sản phẩm</Link>
          {product.category && (
            <>
              <span>/</span>
              <span className="text-foreground">{product.category.name}</span>
            </>
          )}
        </nav>

        <Link href="/san-pham" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Quay lại
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Thumbnails — ngang trên mobile, dọc trên desktop */}
            {product.images.length > 1 && (
              <div className="order-2 md:order-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible md:w-20 flex-shrink-0">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative flex-shrink-0 w-16 h-16 md:w-full md:h-auto md:aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      i === selectedImage
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border opacity-70 hover:opacity-100 hover:border-primary/50'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} width={80} height={80} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}

            {/* Ảnh lớn */}
            <div className="order-1 md:order-2 flex-1 relative">
              <div className="relative aspect-square bg-stone-100 rounded-2xl overflow-hidden border border-border">
                {product.images[selectedImage] ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-20 w-20 text-stone-300" />
                  </div>
                )}

                {/* Hết hàng overlay */}
                {product.countInStock === 0 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white text-foreground text-lg font-bold px-4 py-2 rounded-full">Hết hàng</span>
                  </div>
                )}

                {/* Mũi tên ‹ › */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(selectedImage === 0 ? product.images.length - 1 : selectedImage - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-white shadow-md transition-all"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                      onClick={() => setSelectedImage(selectedImage === product.images.length - 1 ? 0 : selectedImage + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-white shadow-md transition-all"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </>
                )}

                {/* Indicator dots + counter */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
                      {product.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImage(i)}
                          className={`rounded-full transition-all ${
                            i === selectedImage ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      {selectedImage + 1}/{product.images.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {product.isFeatured && (
              <span className="inline-flex w-fit px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full mb-3">
                🔥 SẢN PHẨM NỔI BẬT
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-end space-x-4 mb-4 pb-4 border-b border-border">
              <span className="text-4xl font-bold text-primary">{product.price.toLocaleString('vi-VN')}đ</span>
            </div>

            {/* View & Like stats */}
            <div className="flex items-center gap-5 mb-6 text-sm">
              <span className="flex items-center gap-1.5 text-teal-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-semibold">{viewCount}</span> viewing
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <svg className="h-4 w-4" fill={likeCount > 0 ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                </svg>
                <span className="font-semibold">{likeCount}</span> liked
              </span>
            </div>

            {product.shortDescription && (
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* CTA Liên hệ đặt hàng */}
            <p className="text-sm font-medium text-muted-foreground mb-2">Liên hệ đặt hàng qua:</p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
              {/* Gọi điện */}
              {(!contactButtons || contactButtons.phone?.enabled !== false) && (
                <a
                  href={`tel:${contactButtons?.phone?.number || '0123456789'}`}
                  className="bg-green-600 text-white font-bold h-11 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 gap-1.5 text-xs sm:text-sm px-2"
                >
                  <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span className="truncate">{contactButtons?.phone?.label || '0123 456 789'}</span>
                </a>
              )}

              {/* Zalo */}
              {(!contactButtons || contactButtons.zalo?.enabled !== false) && (
                <a
                  href={contactButtons?.zalo?.id || 'https://zalo.me/0123456789'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white font-bold h-11 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 gap-1.5 text-xs sm:text-sm px-2"
                >
                  <img src="/logo_zalo.png" alt="Zalo" className="h-6 w-6 object-contain flex-shrink-0" />
                  <span className="truncate">{contactButtons?.zalo?.label || 'Chat Zalo'}</span>
                </a>
              )}

              {/* Messenger */}
              {(!contactButtons || contactButtons.messenger?.enabled !== false) && (
                <a
                  href={contactButtons?.messenger?.id || 'https://m.me/nongsanshop'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-[#0695FF] via-[#A334FA] to-[#FF6968] text-white font-bold h-11 rounded-full flex items-center justify-center hover:opacity-90 transition-all shadow-lg shadow-purple-400/20 gap-1.5 text-xs sm:text-sm px-2"
                >
                  <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.906 1.453 5.497 3.733 7.188v3.569l3.405-1.869A11.28 11.28 0 0012 20.486c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.07 12.451l-2.55-2.717-4.98 2.717 5.478-5.814 2.613 2.717 4.916-2.717-5.477 5.814z"/>
                  </svg>
                  <span className="truncate">{contactButtons?.messenger?.label || 'Messenger'}</span>
                </a>
              )}
            </div>

            {/* Action buttons: Like, Wishlist, Share */}
            <div className="flex items-center gap-3 mb-8">
              {/* Like */}
              <button
                onClick={handleLike}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                  liked ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-border text-muted-foreground hover:bg-muted'
                }`}
                title="Thích"
              >
                <svg className="h-5 w-5" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={liked ? 0 : 1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                </svg>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => { toggleWishlist(); toast(isInWishlist ? 'Đã bỏ yêu thích' : 'Đã thêm vào yêu thích ❤️'); }}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                  isInWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'border-border text-muted-foreground hover:bg-muted'
                }`}
                title="Yêu thích"
              >
                <svg className="h-5 w-5" fill={isInWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isInWishlist ? 0 : 1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="w-12 h-12 rounded-full border border-border text-muted-foreground flex items-center justify-center hover:bg-muted transition-all"
                title="Chia sẻ"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto pt-6 border-t border-border">
              <div className="flex items-center p-4 bg-muted/50 rounded-xl">
                <Truck className="h-8 w-8 text-primary mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground text-sm">Giao hàng toàn quốc</h4>
                  <p className="text-xs text-muted-foreground">Miễn phí đơn trên 500.000đ</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-muted/50 rounded-xl">
                <Shield className="h-8 w-8 text-primary mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground text-sm">Cam kết chất lượng</h4>
                  <p className="text-xs text-muted-foreground">Hoàn tiền 100% nếu lỗi</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Mô tả chi tiết / Đánh giá */}
        <div className="mt-16 border-t border-border pt-10">
          <ProductTabs description={product.description} productId={product._id} />
        </div>

        {/* Sản phẩm liên quan */}
        {product.category && (
          <RelatedProducts categoryId={product.category._id} currentProductId={product._id} />
        )}
      </div>
    </div>
  );
}

// ===== RELATED PRODUCTS =====
function RelatedProducts({ categoryId, currentProductId }: { categoryId: string; currentProductId: string }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get('/products')
      .then(({ data }) => {
        const related = data
          .filter((p: Product) => p.category?._id === categoryId && p._id !== currentProductId)
          .slice(0, 6);
        setProducts(related);
      })
      .catch(() => {});
  }, [categoryId, currentProductId]);

  if (products.length === 0) return null;

  return (
    <div className="mt-16 border-t border-border pt-10">
      <h2 className="text-2xl font-bold text-foreground mb-6">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <Link key={p._id} href={`/san-pham/${p.slug}`} className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all">
            <div className="relative aspect-square bg-stone-100 overflow-hidden">
              {p.images[0] ? (
                <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center"><ImageIcon className="h-10 w-10 text-stone-300" /></div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                {p.name}
              </h3>
              <p className="text-primary font-bold mt-2 text-sm">{p.price.toLocaleString('vi-VN')}đ</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ===== PRODUCT TABS COMPONENT =====
function ProductTabs({ description, productId }: { description: string; productId: string }) {
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const userInfo = useUserStore((state) => state.userInfo);

  useEffect(() => {
    if (activeTab === 'reviews' && comments.length === 0) {
      setLoadingComments(true);
      api.get(`/comments/${productId}`)
        .then(({ data }) => setComments(data))
        .catch(() => {})
        .finally(() => setLoadingComments(false));
    }
  }, [activeTab, productId, comments.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post('/comments', {
        product: productId,
        name: userInfo ? userInfo.name : (name.trim() || 'Khách'),
        content: content.trim(),
        rating,
      });
      setComments((prev) => [data, ...prev]);
      setContent('');
      setName('');
      setRating(5);
      toast.success('Đã gửi đánh giá!');
    } catch {
      toast.error('Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Tab headers */}
      <div className="flex gap-1 border-b border-border mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('description')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
            activeTab === 'description'
              ? 'text-primary border-primary'
              : 'text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          Mô tả chi tiết
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
            activeTab === 'reviews'
              ? 'text-primary border-primary'
              : 'text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          Đánh giá ({comments.length})
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'description' ? (
        <div className="prose prose-stone max-w-none">
          {description ? (
            <div className="text-muted-foreground leading-[1.9] whitespace-pre-line text-[15px]">
              {description}
            </div>
          ) : (
            <p className="text-muted-foreground italic">Chưa có mô tả chi tiết cho sản phẩm này.</p>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Form viết đánh giá */}
          <form onSubmit={handleSubmit} className="bg-muted/30 rounded-2xl p-6 border border-border">
            <h3 className="font-bold text-foreground mb-4">Viết đánh giá của bạn</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {!userInfo && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Tên của bạn</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Tên hiển thị (để trống = Khách)"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Đánh giá</label>
                <div className="flex items-center gap-1 h-[42px]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-0.5"
                    >
                      <svg
                        className={`h-7 w-7 transition-colors ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-gray-300'}`}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    </button>
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">{rating}/5</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-1">Nội dung đánh giá *</label>
              <textarea
                required
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
            >
              {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </form>

          {/* Danh sách đánh giá */}
          {loadingComments ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">💬</div>
              <p className="text-muted-foreground">Chưa có đánh giá nào.</p>
              <p className="text-sm text-muted-foreground mt-1">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment: any) => (
                <div key={comment._id} className="bg-white border border-border rounded-xl p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                        {(comment.name || 'K')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">{comment.name || 'Khách'}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg
                          key={s}
                          className={`h-4 w-4 ${s <= comment.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-gray-200'}`}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
