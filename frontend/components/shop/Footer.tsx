import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ShopFooter() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <img src="/logo_anvat.png" alt="KhôVặt" className="h-20 w-auto object-contain mb-4" />
            <p className="text-stone-400 mb-6 leading-relaxed text-sm">
              Chuyên cung cấp đồ ăn vặt chất lượng: khô bò, khô gà, mực rim, trái cây sấy, đậu các loại, hạt dinh dưỡng. Nguyên liệu sạch, không chất bảo quản.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="h-10 w-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-stone-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="#" className="h-10 w-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-stone-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href="#" className="h-10 w-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-stone-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.83a8.18 8.18 0 0 0 4.79 1.53V6.88a4.85 4.85 0 0 1-1.02-.19z" /></svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Sản phẩm</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/san-pham" className="text-stone-400 hover:text-primary transition-colors">Tất cả sản phẩm</Link></li>
              <li><Link href="/san-pham?category=kho-bo" className="text-stone-400 hover:text-primary transition-colors">Khô Bò</Link></li>
              <li><Link href="/san-pham?category=kho-ga" className="text-stone-400 hover:text-primary transition-colors">Khô Gà</Link></li>
              <li><Link href="/san-pham?category=combo" className="text-stone-400 hover:text-primary transition-colors">Combo Tiết Kiệm</Link></li>
              <li><Link href="/blog" className="text-stone-400 hover:text-primary transition-colors">Tin tức & Công thức</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Hỗ trợ</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/ve-chung-toi" className="text-stone-400 hover:text-primary transition-colors">Về chúng tôi</Link></li>
              <li><Link href="/lien-he" className="text-stone-400 hover:text-primary transition-colors">Liên hệ</Link></li>
              <li><Link href="/faq" className="text-stone-400 hover:text-primary transition-colors">Câu hỏi thường gặp</Link></li>
              <li><Link href="/yeu-thich" className="text-stone-400 hover:text-primary transition-colors">Sản phẩm yêu thích</Link></li>
              <li><Link href="/tai-khoan" className="text-stone-400 hover:text-primary transition-colors">Tài khoản của tôi</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Liên hệ</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-primary shrink-0 mt-0.5" />
                <span className="text-stone-400">123 Đường Nông Sản, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary shrink-0" />
                <a href="tel:0123456789" className="text-stone-400 hover:text-primary transition-colors">0123 456 789</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary shrink-0" />
                <a href="mailto:contact@nongsanshop.vn" className="text-stone-400 hover:text-primary transition-colors">contact@nongsanshop.vn</a>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-stone-800 rounded-xl text-xs text-stone-500">
              <div className="font-semibold mb-1 text-stone-400">Giờ làm việc:</div>
              <div>Thứ 2 - Thứ 7: 8:00 - 20:00</div>
              <div>Chủ nhật: 9:00 - 17:00</div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-stone-500 text-sm">
            &copy; {new Date().getFullYear()} KhôVặt. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span>COD</span>
            <span>•</span>
            <span>Chuyển khoản</span>
            <span>•</span>
            <span>Giao toàn quốc</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
