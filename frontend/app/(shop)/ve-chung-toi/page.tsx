import Link from 'next/link';
import { ArrowRight, Leaf, Award, Users, Truck, Heart, ShieldCheck } from 'lucide-react';
import PageBanner from '@/components/shop/PageBanner';

export default function AboutPage() {
  return (
    <div>
      <PageBanner
        title="Về Chúng Tôi"
        subtitle="Chuyên cung cấp đồ ăn vặt sạch, ngon, đa dạng — từ khô bò, mực rim đến trái cây sấy và hạt dinh dưỡng."
        breadcrumb="Trang chủ"
        tags={[
          { label: 'Nguyên liệu sạch', emoji: '✅' },
          { label: 'Không chất bảo quản', emoji: '🚫' },
          { label: '50+ sản phẩm', emoji: '🍿' },
        ]}
      />

      {/* Câu chuyện */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                Câu chuyện
              </span>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Từ Đam Mê Ăn Vặt Đến <span className="text-primary">Thương Hiệu Uy Tín</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  KhôVặt ra đời từ niềm đam mê với đồ ăn vặt Việt Nam. Chúng tôi tin rằng ăn vặt 
                  cũng phải sạch, phải ngon, và phải an toàn cho sức khỏe.
                </p>
                <p>
                  Với hơn 50 sản phẩm đa dạng — từ khô bò, khô gà, mực rim me đến trái cây sấy, 
                  đậu hạt dinh dưỡng — tất cả đều được tuyển chọn kỹ lưỡng từ nguồn nguyên liệu 
                  tươi sạch, chế biến thủ công không sử dụng chất bảo quản hay phẩm màu công nghiệp.
                </p>
                <p>
                  Chúng tôi hợp tác trực tiếp với các cơ sở sản xuất uy tín, kiểm soát chất lượng 
                  nghiêm ngặt từ khâu nguyên liệu đầu vào đến thành phẩm. Mỗi sản phẩm khi đến 
                  tay khách hàng đều đảm bảo <strong className="text-primary">tươi, sạch, giòn ngon</strong>.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl h-[400px] flex items-center justify-center shadow-inner">
                <div className="text-center space-y-4">
                  <div className="text-8xl animate-pulse">🍿🥜🍖</div>
                  <p className="text-muted-foreground font-medium">Đồ ăn vặt đa dạng & chất lượng</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary text-white rounded-2xl shadow-xl p-6 animate-bounce-slow">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm opacity-80">Sản phẩm</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Giá trị cốt lõi */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
              Giá trị
            </span>
            <h2 className="text-3xl font-bold text-foreground mb-4">Giá Trị Cốt Lõi</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: 'Nguyên liệu tươi sạch', desc: 'Tuyển chọn kỹ từ nguồn cung uy tín, đạt chuẩn an toàn thực phẩm.', color: 'text-green-600', bg: 'bg-green-100' },
              { icon: Award, title: 'Không chất bảo quản', desc: 'Chế biến thủ công, sấy tự nhiên, không dùng phẩm màu hay hóa chất.', color: 'text-amber-600', bg: 'bg-amber-100' },
              { icon: Heart, title: 'An toàn cho gia đình', desc: 'Sản phẩm phù hợp cho mọi lứa tuổi, từ trẻ em đến người lớn.', color: 'text-red-500', bg: 'bg-red-100' },
              { icon: Truck, title: 'Giao hàng tận nơi', desc: 'Đóng gói cẩn thận, ship toàn quốc qua các đơn vị vận chuyển uy tín.', color: 'text-blue-600', bg: 'bg-blue-100' },
              { icon: Users, title: 'Tư vấn tận tâm', desc: 'Hỗ trợ qua Zalo, Messenger, điện thoại — phản hồi nhanh trong 15 phút.', color: 'text-purple-600', bg: 'bg-purple-100' },
              { icon: ShieldCheck, title: 'Đổi trả dễ dàng', desc: 'Cam kết hoàn tiền hoặc đổi mới nếu sản phẩm không đúng chất lượng.', color: 'text-emerald-600', bg: 'bg-emerald-100' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-14 h-14 ${item.bg} rounded-xl flex items-center justify-center mb-5`}>
                    <Icon className={`h-7 w-7 ${item.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Con số ấn tượng */}
      <section className="py-16 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { num: '50+', label: 'Sản phẩm đa dạng' },
              { num: '100%', label: 'Nguyên liệu sạch' },
              { num: '0', label: 'Chất bảo quản' },
              { num: '24h', label: 'Phản hồi nhanh' },
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">{stat.num}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-4">Bạn đã sẵn sàng trải nghiệm?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Hãy khám phá bộ sưu tập sản phẩm ngon lành của chúng tôi ngay hôm nay.
          </p>
          <Link
            href="/san-pham"
            className="inline-flex items-center px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20"
          >
            Xem sản phẩm <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
