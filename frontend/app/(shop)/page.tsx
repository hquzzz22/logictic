'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import api from '@/lib/api';
import ProductCarousel from '@/components/shop/ProductCarousel';
import CategorySection from '@/components/shop/CategorySection';
import CategoryTabs from '@/components/shop/CategoryTabs';
import AnimateOnScroll from '@/components/shop/AnimateOnScroll';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  isFeatured: boolean;
  countInStock: number;
  description?: string;
  category: { name: string } | null;
}

interface CategoryWithProducts {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  products: Product[];
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  createdAt: string;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<CategoryWithProducts[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/products?featured=true').then(({ data }) => setFeaturedProducts(data)),
      api.get('/categories/with-products?limit=8').then(({ data }) => setCategoriesWithProducts(data)),
      api.get('/posts').then(({ data }) => setRecentPosts(data.slice(0, 3))),
    ])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center py-16 lg:py-24 gap-12">
            <div className="lg:w-1/2 z-10 space-y-8">
              <span className="inline-flex px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold tracking-wide">
                🍿 ĐỒ ĂN VẶT SẠCH & NGON
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Ăn Vặt Chất Lượng <br />
                <span className="text-primary">Giòn Ngon</span> Mỗi Ngày
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Khô bò, mực rim, trái cây sấy, đậu các loại — tất cả được tuyển chọn từ nguồn nguyên liệu sạch, chế biến thủ công không chất bảo quản.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/san-pham"
                  className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center group shadow-lg shadow-primary/30"
                >
                  Mua ngay
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/san-pham"
                  className="px-8 py-4 bg-white text-foreground border border-border rounded-xl font-medium hover:bg-muted transition-all flex items-center justify-center"
                >
                  Xem sản phẩm
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-xs text-muted-foreground">Sản phẩm</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-xs text-muted-foreground">Sạch & An toàn</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">5★</div>
                  <div className="text-xs text-muted-foreground">Đánh giá</div>
                </div>
              </div>
            </div>

            {/* Danh mục — mobile only */}
            {categoriesWithProducts.length > 0 && (
              <div className="lg:hidden w-full mt-6">
                <div className="flex gap-3 overflow-x-auto pb-2 cat-mobile-scroll">
                  {categoriesWithProducts.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/san-pham?category=${cat.slug}`}
                      className="flex flex-col items-center gap-2 p-3 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm active:scale-95 transition-transform flex-shrink-0 w-24"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100">
                        {(cat as any).image ? (
                          <img src={(cat as any).image} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <img src="/default-category.svg" alt={cat.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span className="text-xs font-semibold text-foreground/80 text-center leading-tight">
                        {cat.name}
                      </span>
                    </Link>
                  ))}
                </div>
                <style jsx>{`
                  .cat-mobile-scroll::-webkit-scrollbar { display: none; }
                  .cat-mobile-scroll { scrollbar-width: none; }
                `}</style>
              </div>
            )}

            <div className="hidden lg:block lg:w-1/2 relative">
              <div className="relative w-full min-h-[300px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-amber-100 to-orange-100 p-6">
                {/* Grid danh mục sản phẩm từ API */}
                {categoriesWithProducts.length > 0 ? (
                  <div className="w-full max-h-[450px] overflow-y-auto py-2 cat-desktop-scroll">
                    <div className="grid grid-cols-3 gap-4 w-full max-w-md mx-auto">
                    {categoriesWithProducts.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/san-pham?category=${cat.slug}`}
                        className="flex flex-col items-center gap-2 p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm hover:scale-105 hover:shadow-md transition-all group"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 flex items-center justify-center">
                          {(cat as any).image ? (
                            <img src={(cat as any).image} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                            <img src="/default-category.svg" alt={cat.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="text-xs font-bold text-foreground/80 group-hover:text-primary transition-colors text-center leading-tight">
                          {cat.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <style jsx>{`
                    .cat-desktop-scroll::-webkit-scrollbar { width: 4px; }
                    .cat-desktop-scroll::-webkit-scrollbar-track { background: transparent; }
                    .cat-desktop-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
                  `}</style>
                </div>
                ) : (
                  <div className="grid grid-cols-3 gap-6 w-full max-w-sm">
                    {['🥩 Khô bò', '🍗 Khô gà', '🦑 Mực rim', '🥭 Trái cây', '🥜 Đậu hạt', '🍪 Snack'].map((item, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm">
                        <span className="text-3xl">{item.split(' ')[0]}</span>
                        <span className="text-xs font-semibold text-foreground/70">{item.split(' ').slice(1).join(' ')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-[-60px] right-[-60px] w-[200px] h-[200px] rounded-full border-[25px] border-primary/5 pointer-events-none hidden lg:block" />
        <div className="absolute bottom-[40px] right-[10%] w-[80px] h-[80px] rounded-full border-[12px] border-primary/5 pointer-events-none hidden lg:block" />

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-[50px] md:h-[70px] lg:h-[90px]"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120V90C120 100 240 105 360 95C540 80 720 50 900 45C1080 40 1260 60 1380 75L1440 80V120H0Z"
              className="fill-white/30"
            />
            <path
              d="M0 120V100C180 65 360 45 540 50C720 55 900 80 1080 85C1200 88 1320 78 1440 70V120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {loading ? (
            <div>
              <div className="h-8 w-64 bg-stone-200 rounded mb-8 animate-pulse" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse shadow-sm">
                    <div className="m-2 h-52 bg-stone-200 rounded-xl" />
                    <div className="px-4 pb-4 space-y-3">
                      <div className="h-3 bg-stone-200 rounded w-1/3" />
                      <div className="h-4 bg-stone-200 rounded w-3/4" />
                      <div className="h-5 bg-stone-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">Sản Phẩm Nổi Bật</h2>
              <div className="text-center py-12 text-muted-foreground">
                <p>Chưa có sản phẩm nổi bật. Hãy thêm sản phẩm trong trang admin.</p>
                <Link href="/san-pham" className="inline-flex items-center mt-4 text-primary hover:underline font-medium">
                  Xem tất cả sản phẩm <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <ProductCarousel title="Sản Phẩm Nổi Bật" products={featuredProducts} />
              <div className="text-center mt-10">
                <Link
                  href="/san-pham"
                  className="inline-flex items-center font-bold text-primary hover:text-primary/80 transition-colors"
                >
                  Xem tất cả sản phẩm <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Menu — Tất cả sản phẩm theo danh mục */}
      {categoriesWithProducts.length > 0 && (
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Menu</h2>
              <div className="w-20 h-1 bg-primary rounded-full mt-2" />
            </div>

            {/* Tabs điều hướng sticky */}
            <CategoryTabs
              categories={categoriesWithProducts.map((c) => ({ _id: c._id, name: c.name, slug: c.slug }))}
            />

            {/* Các section danh mục */}
            <div className="space-y-8">
              {categoriesWithProducts.map((cat) => (
                <CategorySection
                  key={cat._id}
                  id={`cat-${cat.slug}`}
                  categoryName={cat.name}
                  categorySlug={cat.slug}
                  products={cat.products}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why choose us */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Tại Sao Chọn Chúng Tôi?</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Nguyên liệu sạch 100%',
                desc: 'Tất cả sản phẩm được tuyển chọn kỹ lưỡng từ nguồn nguyên liệu sạch, đạt chuẩn VSATTP.',
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                color: 'text-green-600',
                bg: 'bg-green-50',
              },
              {
                title: 'Không chất bảo quản',
                desc: 'Chế biến thủ công, sấy tự nhiên, giữ nguyên hương vị. Ăn vặt an tâm cho cả gia đình.',
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                  </svg>
                ),
                color: 'text-orange-500',
                bg: 'bg-orange-50',
              },
              {
                title: 'Đa dạng sản phẩm',
                desc: 'Hơn 50 loại: khô bò, mực, trái cây sấy, đậu các loại, hạt dinh dưỡng, bánh snack.',
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                ),
                color: 'text-purple-600',
                bg: 'bg-purple-50',
              },
            ].map((item, i) => (
              <AnimateOnScroll key={i} animation="fade-up" delay={i * 150}>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-border text-center hover:shadow-md transition-shadow">
                  <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-5 ${item.color}`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Tin Tức & Công Thức</h2>
              <div className="w-24 h-1 bg-primary rounded-full" />
            </div>
            <Link href="/blog" className="hidden md:inline-flex items-center text-primary font-semibold hover:underline">
              Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>Chưa có bài viết nào. Hãy thêm bài viết trong trang admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Link key={post._id} href={`/blog/${post.slug}`} className="group rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all">
                  <div className="relative h-48 bg-stone-100 overflow-hidden">
                    {post.image ? (
                      <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-5xl">📝</div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <h3 className="text-lg font-bold text-foreground mt-2 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {post.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>
                    <span className="inline-flex items-center text-sm text-primary font-medium mt-4">
                      Đọc thêm <ArrowRight className="ml-1 h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Đặt hàng ngay hôm nay
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Hơn 50 loại đồ ăn vặt chất lượng. Liên hệ Zalo hoặc gọi điện để đặt hàng nhanh nhất!
          </p>
          <Link
            href="/san-pham"
            className="inline-flex items-center px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-all shadow-lg"
          >
            Mua sắm ngay
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
