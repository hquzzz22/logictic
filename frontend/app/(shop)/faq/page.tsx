'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, Search, Phone, Mail } from 'lucide-react';
import PageBanner from '@/components/shop/PageBanner';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  // Sản phẩm
  {
    category: 'Sản phẩm',
    question: 'Đồ ăn vặt của KhôVặt có sử dụng chất bảo quản không?',
    answer: 'Tuyệt đối không. Tất cả sản phẩm được chế biến thủ công, sấy tự nhiên, không sử dụng chất bảo quản, phẩm màu hay hóa chất công nghiệp. An toàn cho cả gia đình.',
  },
  {
    category: 'Sản phẩm',
    question: 'Hạn sử dụng sản phẩm là bao lâu?',
    answer: 'Tùy loại sản phẩm: khô bò/gà/mực khoảng 3-6 tháng, trái cây sấy 4-6 tháng, đậu/hạt 6-12 tháng (tính từ ngày sản xuất). Bảo quản nơi khô ráo, thoáng mát. Sau khi mở bao bì nên dùng trong 2-3 tuần.',
  },
  {
    category: 'Sản phẩm',
    question: 'Nguồn nguyên liệu từ đâu?',
    answer: 'Chúng tôi hợp tác với các cơ sở sản xuất uy tín tại Việt Nam. Thịt bò, gà từ trang trại đạt chuẩn; hải sản tươi từ biển miền Trung; trái cây từ vùng Tây Nguyên, ĐBSCL; đậu hạt nhập khẩu chất lượng cao.',
  },
  {
    category: 'Sản phẩm',
    question: 'KhôVặt có những loại sản phẩm nào?',
    answer: 'Chúng tôi có hơn 50 loại chia thành 5 nhóm: Khô Bò & Gà (khô trâu, khô gà lá chanh...), Hải Sản Khô (mực rim, da cá trứng muối...), Trái Cây Sấy (mít, xoài, chuối, khoai...), Đậu & Hạt (đậu hà lan, hạt điều, macca...), Bánh & Snack (bắp sấy, nui chiên, bánh gấu...).',
  },
  // Đặt hàng
  {
    category: 'Đặt hàng',
    question: 'Đặt hàng bằng cách nào?',
    answer: 'Bạn có thể đặt hàng qua: Zalo (nhanh nhất), Messenger, hoặc gọi điện trực tiếp. Nhân viên sẽ tư vấn và xác nhận đơn hàng trong vòng 15 phút.',
  },
  {
    category: 'Đặt hàng',
    question: 'Có đặt hàng online trên website được không?',
    answer: 'Hiện tại chúng tôi ưu tiên đặt hàng qua Zalo/ĐT để tư vấn tốt nhất cho bạn. Bạn xem sản phẩm trên web, sau đó liên hệ qua nút Zalo/Gọi ngay ở trang sản phẩm để đặt.',
  },
  {
    category: 'Đặt hàng',
    question: 'Có được mua lẻ từng gói không hay phải mua combo?',
    answer: 'Bạn hoàn toàn có thể mua lẻ từng sản phẩm, không bắt buộc mua combo. Tuy nhiên mua combo sẽ được giá tốt hơn.',
  },
  {
    category: 'Đặt hàng',
    question: 'Thanh toán bằng hình thức nào?',
    answer: 'Chúng tôi hỗ trợ: Chuyển khoản ngân hàng (trước khi giao) hoặc COD (thanh toán khi nhận hàng, áp dụng một số khu vực).',
  },
  // Giao hàng
  {
    category: 'Giao hàng',
    question: 'Phí giao hàng bao nhiêu?',
    answer: 'Phí ship tùy khu vực, dao động 20.000-40.000đ (nội thành TP.HCM/HN) và 30.000-60.000đ (tỉnh). Đơn từ 300.000đ có thể được hỗ trợ phí ship — liên hệ để biết chi tiết.',
  },
  {
    category: 'Giao hàng',
    question: 'Giao hàng mất bao lâu?',
    answer: 'Nội thành TP.HCM: 1-2 ngày. Hà Nội và các thành phố lớn: 2-3 ngày. Tỉnh thành khác: 3-5 ngày làm việc.',
  },
  {
    category: 'Giao hàng',
    question: 'Đóng gói có đảm bảo không bị hư trong quá trình vận chuyển?',
    answer: 'Có. Tất cả sản phẩm được đóng gói kín, hút chân không (với khô/mực), bọc foam chống va đập, đảm bảo đến tay bạn nguyên vẹn.',
  },
  // Đổi trả
  {
    category: 'Đổi trả',
    question: 'Nếu sản phẩm bị hỏng khi nhận, tôi phải làm gì?',
    answer: 'Chụp ảnh/quay video sản phẩm bị lỗi và liên hệ ngay qua Zalo. Chúng tôi sẽ gửi sản phẩm thay thế hoặc hoàn tiền 100% trong vòng 24h xác nhận.',
  },
  {
    category: 'Đổi trả',
    question: 'Có được đổi sản phẩm khác nếu không hợp khẩu vị?',
    answer: 'Nếu sản phẩm đúng chất lượng nhưng không hợp khẩu vị, chúng tôi có thể hỗ trợ đổi sang sản phẩm khác (chưa mở bao bì, trong 3 ngày). Phí ship đổi do khách chịu.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  const categories = ['Tất cả', ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filteredFaqs = faqs.filter((faq) => {
    const matchSearch = search === '' || faq.question.toLowerCase().includes(search.toLowerCase()) || faq.answer.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'Tất cả' || faq.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="bg-muted/10 min-h-screen">
      <PageBanner
        title="Câu Hỏi Thường Gặp"
        subtitle="Tìm câu trả lời nhanh cho thắc mắc của bạn về sản phẩm, đặt hàng và giao hàng."
        breadcrumb="Trang chủ"
        tags={[
          { label: 'Sản phẩm', emoji: '🍿' },
          { label: 'Đặt hàng', emoji: '📱' },
          { label: 'Giao hàng', emoji: '🚚' },
          { label: 'Đổi trả', emoji: '↩️' },
        ]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Search */}
          <div className="max-w-md mx-auto relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
              placeholder="Tìm kiếm câu hỏi..."
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-muted-foreground border border-border hover:border-primary/50 hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg">Không tìm thấy câu hỏi phù hợp</p>
                <p className="text-sm mt-2">Thử tìm kiếm với từ khóa khác hoặc liên hệ trực tiếp với chúng tôi.</p>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-start gap-3 flex-1 pr-4">
                      <span className="text-primary font-bold text-lg leading-none mt-0.5">Q</span>
                      <span className="font-semibold text-foreground text-[15px] leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-5 pb-5 pt-0">
                      <div className="pl-7 border-l-2 border-primary/20 ml-1.5">
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* CTA liên hệ */}
          <div className="mt-16 bg-white rounded-2xl border border-border p-8 text-center shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-3">Không tìm thấy câu trả lời?</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Đội ngũ hỗ trợ của chúng tôi sẵn sàng giúp đỡ bạn.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/lien-he"
                className="inline-flex items-center px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                <Mail className="h-4 w-4 mr-2" />
                Gửi tin nhắn
              </Link>
              <a
                href="tel:0123456789"
                className="inline-flex items-center px-6 py-3 border border-border text-foreground font-medium rounded-xl hover:bg-muted transition-colors"
              >
                <Phone className="h-4 w-4 mr-2" />
                Gọi: 0123 456 789
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
