import { api } from "@/lib/api";
import { 
  Coffee, 
  MapPin, 
  Phone, 
  Clock, 
  Instagram, 
  Facebook, 
  Twitter,
  ArrowRight,
  Star,
  Leaf,
  Award
} from "lucide-react";
import Link from "next/link";

export default async function LandingPage() {
  const [products, categories, configs] = await Promise.all([
    api.getProducts(),
    api.getCategories(),
    api.getConfigs(),
  ]);

  const shopName = configs.find((c: any) => c.key === "ShopName")?.value || "Antigravity Coffee";

  return (
    <div className="bg-[#FAF9F6] text-[#2C1810] font-sans overflow-x-hidden selection:bg-[#D4A373] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#6F4E37] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-100">
              <Coffee size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight font-outfit uppercase">{shopName}</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm font-semibold hover:text-[#D4A373] transition-colors">Giới Thiệu</a>
            <a href="#menu" className="text-sm font-semibold hover:text-[#D4A373] transition-colors">Thực Đơn</a>
            <a href="#contact" className="text-sm font-semibold hover:text-[#D4A373] transition-colors">Liên Hệ</a>
            <Link 
              href="/dashboard" 
              className="px-5 py-2.5 bg-[#6F4E37] text-white rounded-full text-sm font-bold shadow-lg shadow-orange-100 hover:scale-105 transition-all"
            >
              Quản Trị Hệ Thống
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover brightness-50"
            alt="Coffee Shop Hero"
          />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <span className="inline-block px-4 py-1.5 bg-[#D4A373]/20 backdrop-blur-md border border-[#D4A373]/30 rounded-full text-[#D4A373] text-sm font-bold mb-6 tracking-widest uppercase">
            EST. 2024 • SÀI GÒN
          </span>
          <h1 className="text-5xl md:text-8xl font-bold font-outfit mb-8 leading-[1.1]">
            Nghệ Thuật <span className="text-[#D4A373]">Cà Phê Thượng Hạng</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-medium">
            Khám phá thánh địa của hương vị, nơi mỗi hạt cà phê là một câu chuyện và mỗi tách cà phê là một kiệt tác được chế tác bởi những bậc thầy rang xay.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#menu" 
              className="w-full sm:w-auto px-10 py-5 bg-[#D4A373] text-white rounded-full font-bold text-lg shadow-2xl shadow-orange-900/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Xem Thực Đơn <ArrowRight size={20} />
            </a>
            <a 
              href="#contact" 
              className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all"
            >
              Ghé Thăm Quán
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-[#D4A373]/20 rounded-[3rem] blur-2xl group-hover:bg-[#D4A373]/30 transition-all duration-500"></div>
            <img 
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1000&auto=format&fit=crop" 
              className="relative z-10 w-full rounded-[2.5rem] shadow-2xl"
              alt="About Our Coffee"
            />
          </div>
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 text-[#D4A373] font-bold tracking-widest uppercase text-sm">
              <span className="w-12 h-px bg-[#D4A373]"></span>
              Câu Chuyện Của Chúng Tôi
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-outfit text-[#2C1810]">
              Đam Mê Trong Từng Giọt Cà Phê
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Tại {shopName}, chúng tôi không chỉ phục vụ đồ uống; chúng tôi mang đến trải nghiệm. Hành trình của chúng tôi bắt đầu với một sứ mệnh đơn giản: nâng tầm nghi thức uống cà phê hàng ngày thành những khoảnh khắc phi thường của niềm vui.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-[#6F4E37]">
                  <Leaf size={24} />
                </div>
                <h4 className="font-bold text-lg">100% Hữu Cơ</h4>
                <p className="text-sm text-slate-500">Nguồn cung ứng từ các nông trại bền vững trên toàn cầu.</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-[#6F4E37]">
                  <Award size={24} />
                </div>
                <h4 className="font-bold text-lg">Rang Xay Bậc Thầy</h4>
                <p className="text-sm text-slate-500">Được rang bởi các chuyên gia để khai phá trọn vẹn hương vị.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-[#D4A373] font-bold tracking-widest uppercase text-sm mb-4">
              <Star size={16} /> Thực Đơn Đặc Trưng <Star size={16} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-outfit text-[#2C1810]">Hương Vị Tuyển Chọn</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-[2rem] aspect-square mb-6">
                  <img 
                    src={product.imageUrl} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={product.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                    <button className="w-full py-3 bg-white text-[#2C1810] rounded-full font-bold shadow-xl">
                      Xem Nhanh
                    </button>
                  </div>
                  <div className="absolute top-4 right-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-black text-[#D4A373] uppercase shadow-sm">
                    {product.category?.name === 'Coffee' ? 'Cà Phê' : product.category?.name === 'Tea' ? 'Trà' : 'Bánh Ngọt'}
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-[#D4A373] transition-colors">{product.name}</h3>
                    <p className="text-slate-500 text-sm">{product.description}</p>
                  </div>
                  <span className="text-xl font-black text-[#6F4E37]">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-[#6F4E37] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <h2 className="text-4xl md:text-5xl font-bold font-outfit">Hãy ghé thăm chúng tôi để thưởng thức sự tinh tế.</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-[#D4A373]">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Địa Chỉ</h4>
                    <p className="text-white/70">123 Đường Đồng Khởi, Quận 1<br/>Thành phố Hồ Chí Minh, Việt Nam</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-[#D4A373]">
                    <Phone size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Liên Hệ</h4>
                    <p className="text-white/70">+84 90 123 4567<br/>hello@antigravitycoffee.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-[#D4A373]">
                    <Clock size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Giờ Mở Cửa</h4>
                    <p className="text-white/70">Thứ 2 - Thứ 6: 7:00 AM - 9:00 PM<br/>Thứ 7 - CN: 8:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-2xl font-bold text-[#2C1810] mb-6 text-center">Gửi tin nhắn cho chúng tôi</h3>
              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Họ và Tên" 
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-[#2C1810] focus:ring-2 focus:ring-[#D4A373] outline-none"
                />
                <input 
                  type="email" 
                  placeholder="Địa chỉ Email" 
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-[#2C1810] focus:ring-2 focus:ring-[#D4A373] outline-none"
                />
                <textarea 
                  rows={4} 
                  placeholder="Tin nhắn của bạn" 
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-[#2C1810] focus:ring-2 focus:ring-[#D4A373] outline-none"
                ></textarea>
                <button className="w-full py-5 bg-[#6F4E37] text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-900/10 hover:brightness-110 transition-all">
                  Gửi Tin Nhắn
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-orange-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6F4E37] rounded-lg flex items-center justify-center text-white">
              <Coffee size={18} />
            </div>
            <span className="font-bold tracking-tight font-outfit uppercase text-sm">{shopName}</span>
          </div>
          <div className="text-slate-400 text-sm font-medium">
            © 2026 {shopName}. Bảo lưu mọi quyền.
          </div>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[#6F4E37] hover:bg-[#6F4E37] hover:text-white transition-all"><Instagram size={20} /></a>
            <a href="#" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[#6F4E37] hover:bg-[#6F4E37] hover:text-white transition-all"><Facebook size={20} /></a>
            <a href="#" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[#6F4E37] hover:bg-[#6F4E37] hover:text-white transition-all"><Twitter size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
