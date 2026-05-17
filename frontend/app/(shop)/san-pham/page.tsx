'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Filter, ChevronDown, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import ProductCard from '@/components/shop/ProductCard';
import PageBanner from '@/components/shop/PageBanner';
import { Suspense } from 'react';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: Category | null;
  countInStock: number;
  isFeatured: boolean;
  description?: string;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('');
  const [showSort, setShowSort] = useState(false);

  // Sync URL params → state khi URL thay đổi (navigate từ header dropdown)
  useEffect(() => {
    const urlCategory = searchParams.get('category') || '';
    setSelectedCategory(urlCategory);
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (sortBy) params.append('sort', sortBy);

        const [productsRes, categoriesRes] = await Promise.all([
          api.get(`/products?${params.toString()}`),
          api.get('/categories'),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch {
        toast.error('Không thể tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, sortBy]);

  const handleAddToCart = (product: Product) => {
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

  const sortLabels: Record<string, string> = {
    '': 'Mới nhất',
    price_asc: 'Giá tăng dần',
    price_desc: 'Giá giảm dần',
    name: 'Tên A-Z',
  };

  return (
    <div className="bg-muted/10 min-h-screen">
      <PageBanner
        title="Sản Phẩm"
        subtitle="Khám phá hương vị đậm đà từ các loại nông sản khô chất lượng nhất."
        breadcrumb="Trang chủ"
      />

      <div className="container mx-auto px-4 py-12">

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filter */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm sticky top-24">
              <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-border">
                <Filter className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">Bộ Lọc</h2>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-foreground">Danh Mục</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCategory === '' ? 'bg-primary border-primary' : 'border-gray-300 group-hover:border-primary'}`}
                      onClick={() => setSelectedCategory('')}
                    >
                      {selectedCategory === '' && <div className="w-2 h-2 bg-white rounded-sm" />}
                    </div>
                    <span
                      className={`text-sm cursor-pointer ${selectedCategory === '' ? 'font-medium text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
                      onClick={() => setSelectedCategory('')}
                    >
                      Tất cả
                    </span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex items-center space-x-3 cursor-pointer group">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCategory === cat.slug ? 'bg-primary border-primary' : 'border-gray-300 group-hover:border-primary'}`}
                        onClick={() => setSelectedCategory(cat.slug)}
                      >
                        {selectedCategory === cat.slug && <div className="w-2 h-2 bg-white rounded-sm" />}
                      </div>
                      <span
                        className={`text-sm cursor-pointer ${selectedCategory === cat.slug ? 'font-medium text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
                        onClick={() => setSelectedCategory(cat.slug)}
                      >
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-muted-foreground">
                {loading ? 'Đang tải...' : `Hiển thị ${products.length} sản phẩm`}
              </span>
              <div className="relative">
                <button
                  onClick={() => setShowSort(!showSort)}
                  className="flex items-center space-x-2 text-sm border border-border px-4 py-2 rounded-lg bg-white hover:bg-muted transition-colors"
                >
                  <span>Sắp xếp: {sortLabels[sortBy]}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {showSort && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-lg shadow-lg z-10 min-w-[160px]">
                    {Object.entries(sortLabels).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => { setSortBy(value); setShowSort(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${sortBy === value ? 'text-primary font-medium' : 'text-foreground'}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse m-1">
                    <div className="m-2 h-52 bg-stone-200 rounded-xl" />
                    <div className="px-4 pb-4 space-y-3">
                      <div className="h-3 bg-stone-200 rounded w-1/3" />
                      <div className="h-4 bg-stone-200 rounded w-3/4" />
                      <div className="h-3 bg-stone-200 rounded w-full" />
                      <div className="h-5 bg-stone-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Không có sản phẩm nào trong danh mục này</p>
              </div>
            ) : (
              <>
                {/* Desktop/Tablet: Grid cards */}
                <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Mobile: List view */}
                <div className="sm:hidden divide-y divide-border">
                  {products.map((product) => (
                    <Link key={product._id} href={`/san-pham/${product.slug}`} className="flex items-start gap-4 py-4 group">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-[15px] leading-snug">
                          {product.name}
                        </h3>
                        <p className="text-primary font-bold mt-1">{product.price.toLocaleString('vi-VN')}đ</p>
                        {product.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                            {product.description.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 relative">
                        {product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5a2.25 2.25 0 002.25 2.25z" /></svg>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
