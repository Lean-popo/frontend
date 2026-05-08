"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { 
  Users, 
  CalendarCheck, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Coffee,
  Loader2
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const userDataString = localStorage.getItem("user");
        const userObj = userDataString ? JSON.parse(userDataString) : null;
        const role = userObj?.role || "Staff";

        const [users, attendances, shifts, payrolls] = await Promise.all([
          role === "Admin" ? api.getUsers() : Promise.resolve([]),
          api.getAttendances(),
          (role === "Admin" || role === "Manager") ? api.getShifts() : Promise.resolve([]),
          (role === "Admin" || role === "Manager") ? api.getPayrolls() : Promise.resolve([]),
        ]);
        setData({ users, attendances, shifts, payrolls });
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
        if (err.message.includes("401") || err.message.includes("Unauthorized")) {
            router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
        <p className="font-medium">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-red-500">
        <p className="font-bold text-xl mb-2">Đã có lỗi xảy ra</p>
        <p className="text-slate-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-indigo-500 text-white rounded-xl shadow-lg"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const { users, attendances, shifts, payrolls } = data;
  const totalSalary = payrolls.reduce((acc: number, p: any) => acc + (Number(p.salaryAmount) || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight font-outfit text-slate-800">Bảng Điều Khiển</h1>
          <p className="text-slate-500 mt-2">Chào mừng trở lại! Đây là tóm tắt hoạt động hôm nay.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors">
            Xuất Báo Cáo
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-indigo-200 transition-transform hover:scale-105 active:scale-95">
            Thêm Chấm Công
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Tổng Nhân Viên" 
          value={users.length.toString()} 
          change="+2%" 
          isUp={true} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatsCard 
          title="Tổng Ca Làm" 
          value={shifts.length.toString()} 
          change="+0" 
          isUp={true} 
          icon={Clock} 
          color="bg-indigo-500" 
        />
        <StatsCard 
          title="Lượt Chấm Công" 
          value={attendances.length.toString()} 
          change="+5%" 
          isUp={true} 
          icon={CalendarCheck} 
          color="bg-purple-500" 
        />
        <StatsCard 
          title="Tổng Lương" 
          value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalSalary)} 
          change="+10%" 
          isUp={true} 
          icon={Wallet} 
          color="bg-pink-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 min-h-[400px] shadow-sm border border-slate-200 overflow-hidden relative">
          <h3 className="text-xl font-bold mb-6 text-slate-800">Xu Hướng Chấm Công</h3>
          <div className="h-64 flex items-end gap-2 sm:gap-4 px-2">
            {[40, 60, 45, 90, 65, 80, 50, 70, 85, 60, 75, 95].map((h, i) => (
              <div key={i} className="flex-1 group relative">
                <div 
                  className="w-full bg-indigo-50 rounded-t-lg transition-all duration-300 group-hover:bg-indigo-500 group-hover:shadow-lg group-hover:shadow-indigo-200" 
                  style={{ height: `${h}%` }}
                ></div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">
                  T{i+1}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold mb-6 text-slate-800">Hoạt Động Gần Đây</h3>
          <div className="space-y-6">
            {[
              { name: "Nguyễn Văn A", action: "Vừa chấm công", time: "2 phút trước", type: "success" },
              { name: "Trần Thị B", action: "Yêu cầu nghỉ phép", time: "1 giờ trước", type: "warning" },
              { name: "Lê Văn C", action: "Đã chốt lương", time: "3 giờ trước", type: "info" },
              { name: "Hệ thống", action: "Đã tạo ca làm mới", time: "5 giờ trước", type: "default" },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full mt-2 bg-indigo-500"></div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-700">{activity.name}</span>
                  <span className="text-xs text-slate-500">{activity.action} • {activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 text-sm font-bold text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors">
            Xem Tất Cả Hoạt Động
          </button>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, change, isUp, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl hover:translate-y-[-4px] transition-all duration-300 group shadow-sm border border-slate-200">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 ${color} text-white rounded-2xl shadow-lg shadow-indigo-100`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${isUp ? "text-emerald-500" : "text-rose-500"}`}>
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-slate-500 text-sm font-medium">{title}</span>
        <span className="text-2xl font-bold mt-1 tracking-tight text-slate-800">{value}</span>
      </div>
    </div>
  );
}
