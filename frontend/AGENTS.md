# Dự án KhôVặt - Ghi nhớ cho AI Agent

## Thông tin chung
- **Thương hiệu:** KhôVặt
- **Loại hình:** Website bán đồ ăn vặt (khô bò, khô gà, mực rim, trái cây sấy, đậu hạt, bánh snack)
- **Mô hình bán hàng:** KHÔNG bán online trực tiếp trên web. Hướng khách liên hệ qua Zalo / Điện thoại / Messenger để đặt hàng.
- **Logo:** `/public/logo_anvat.png` (header, admin) + `/public/logo_zalo.png` (icon Zalo)
- **Path dự án:** `C:\Users\Administrator\Desktop\nongsanshop`
- **Font:** Inter (Vietnamese subset)
- **Màu chủ đạo:** Cam đất `#d97706` (primary), xanh lá `#166534` (secondary)

## Tech Stack
- **Backend:** Node.js + Express 5 + MongoDB (Mongoose 9) — port 5000
- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS v4 + Zustand — port 3000
- **Storage:** Cloudflare R2 (ảnh, video)
- **Editor bài viết:** EditorJS (với VideoTool custom upload R2)
- **Container max-width:** 80rem (1280px)
- **Footer:** nền `bg-stone-900`

## Đăng nhập Admin
- Email: `admin@khovatchat.vn`
- Password: `admin123`
- URL: `http://localhost:3000/admin/dashboard`

## Cấu trúc Backend
```
backend/src/
├── models/ (User, Product, Category, Order, Post, PostCategory, Comment, Contact, Setting)
├── controllers/
├── routes/
├── middlewares/ (auth, upload, error)
├── services/ (r2.service.js)
└── utils/ (seeder.js, generateToken.js)
```

## API Routes
- `/api/users` — Auth, CRUD users
- `/api/products` — CRUD sản phẩm, `/slug/:slug`, filter by category
- `/api/categories` — CRUD, `/with-products`, `/reorder`
- `/api/orders` — CRUD đơn hàng, `/stats`, `/myorders`
- `/api/posts` — CRUD bài viết, `/admin`, `/slug/:slug`
- `/api/post-categories` — CRUD danh mục bài viết
- `/api/comments` — Comment sản phẩm (guest OK)
- `/api/contacts` — Tin nhắn liên hệ từ KH
- `/api/settings/:key` — Cài đặt động (contactButtons, etc.)
- `/api/upload` — Upload ảnh (5MB)
- `/api/upload/video` — Upload video (200MB)

## Cấu trúc Frontend
```
frontend/
├── app/(shop)/ — Trang public (trang chủ, sản phẩm, chi tiết, blog, FAQ, liên hệ, về chúng tôi, yêu thích)
├── app/admin/ — Admin panel (dashboard, products, categories, orders, posts, post-categories, users, contacts, settings)
├── components/shop/ — Header, Footer, ProductCard, ProductCarousel, CategorySection, CategoryTabs, PageBanner, FloatingContact, AnimateOnScroll, ScrollToTop
├── components/admin/ — Sidebar, Header, AdminGuard, ImageUploader, VideoUploader, BlockEditor, editor/EditorJS
├── store/ — Zustand stores (userStore, cartStore, wishlistStore, settingsStore)
├── lib/api.ts — Axios instance
```

## Trang Frontend chính
- `/` — Trang chủ (hero, danh mục, sản phẩm nổi bật carousel, menu theo danh mục, why choose us, blog, CTA)
- `/san-pham` — Danh sách SP (filter sidebar, sort, responsive list mobile)
- `/san-pham/[slug]` — Chi tiết SP (gallery ảnh, 3 nút liên hệ, like/share/view, tabs mô tả + đánh giá, SP liên quan)
- `/blog`, `/blog/[slug]` — Tin tức
- `/ve-chung-toi` — Về chúng tôi
- `/faq` — Câu hỏi thường gặp (13 câu, 4 nhóm)
- `/lien-he` — Form liên hệ (gửi vào DB, admin xem được)
- `/yeu-thich` — Sản phẩm yêu thích (localStorage)
- `/login`, `/register` — Auth

## Tính năng đặc biệt
- **Giỏ hàng:** Code giữ nguyên nhưng UI ẨN. Có thể bật lại sau.
- **3 nút liên hệ:** Gọi ĐT, Zalo, Messenger — cấu hình từ Admin Settings, dùng ở chi tiết SP + floating button + header
- **Header shrink:** Thu nhỏ khi scroll (h-24 → h-14, logo h-20 → h-10)
- **CategoryTabs:** Sticky dưới header, đo chiều cao header bằng JS để khít, auto-scroll tab active
- **ProductCarousel:** Scroll ngang, card peek ở cuối, nút ← → góc phải
- **Scroll animations:** AnimateOnScroll component (fade-up, fade-left, zoom-in...)
- **Fake view count:** Random 20-50, thay đổi mỗi 3-7s
- **Comment:** Guest + logged in user, rating 1-5 sao
- **Drag & drop:** Sắp xếp thứ tự danh mục trong admin
- **EditorJS:** Paste handler Word/Google Docs, upload ảnh/video R2
- **Floating contact:** 3 nút (Gọi, Zalo, Messenger), click ngoài đóng
- **PageBanner:** Wave SVG cong mềm + glow text animation

## Sản phẩm (5 danh mục)
1. Khô Bò & Khô Gà
2. Hải Sản Khô (mực rim, da cá trứng muối...)
3. Trái Cây Sấy (mít, xoài, chuối, khoai...)
4. Đậu & Hạt (đậu hà lan, đậu phộng da cá, hạt điều, macca...)
5. Bánh & Snack (bắp sấy, nui chiên, bánh gấu...)

## Cần làm tiếp
- [ ] ArticleRenderer — render bài viết EditorJS JSON ra HTML đẹp
- [ ] SEO (sitemap.xml, meta tags động cho từng trang/sản phẩm)
- [ ] Deploy production (Vercel + Railway/Render)
- [ ] Thêm ảnh thật cho sản phẩm & danh mục
- [ ] Tối ưu performance (lazy load images, ISR)
- [ ] Trang chính sách (giao hàng, đổi trả)
- [ ] Push notification khi có tin nhắn mới
