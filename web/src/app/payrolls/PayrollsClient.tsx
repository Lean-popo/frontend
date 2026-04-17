"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { 
  Download, 
  Calendar, 
  Plus
} from "lucide-react";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";

export default function PayrollsClient({ 
  initialPayrolls,
  users 
}: { 
  initialPayrolls: any[],
  users: any[]
}) {
  const [payrolls, setPayrolls] = useState(initialPayrolls);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    userId: users[0]?.id || 0,
    totalHours: 0,
    salaryAmount: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createPayroll(formData);
      setIsModalOpen(false);
      const updated = await api.getPayrolls();
      setPayrolls(updated);
      router.refresh();
    } catch (error) {
      alert("Lỗi khi lưu: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight font-outfit">Bảng Lương</h1>
          <p className="text-slate-500 mt-2">Quản lý lương và các khoản thanh toán cho nhân viên.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors">
            <Download size={18} />
            Xuất Báo Cáo
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 premium-gradient text-white rounded-xl font-medium text-sm shadow-lg shadow-indigo-200"
          >
            <Plus size={18} />
            Tính Lương
          </button>
        </div>
      </header>

      <div className="glass rounded-3xl overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Nhân viên</th>
                <th className="px-6 py-4">Kỳ hạn</th>
                <th className="px-6 py-4">Số giờ</th>
                <th className="px-6 py-4">Tổng tiền</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payrolls.map((item: any) => (
                <tr key={item.id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                        {item.user?.fullName?.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <span className="font-semibold text-sm">{item.user?.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Calendar size={14} className="text-slate-400" />
                      Tháng {item.month}, {item.year}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-indigo-500">{item.totalHours} giờ</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.salaryAmount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-bold text-indigo-500 hover:underline">Chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Tính lương mới"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">Nhân viên</label>
            <select 
              required
              className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
              value={formData.userId}
              onChange={(e) => setFormData({...formData, userId: parseInt(e.target.value)})}
            >
              {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Tổng số giờ</label>
              <input 
                type="number"
                step="0.1"
                required
                className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                value={formData.totalHours}
                onChange={(e) => setFormData({...formData, totalHours: parseFloat(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Số tiền lương</label>
              <input 
                type="number"
                required
                className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                value={formData.salaryAmount}
                onChange={(e) => setFormData({...formData, salaryAmount: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Tháng</label>
              <input 
                type="number"
                min={1} max={12}
                required
                className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                value={formData.month}
                onChange={(e) => setFormData({...formData, month: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Năm</label>
              <input 
                type="number"
                required
                className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 premium-gradient text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 mt-6 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Tính Lương"}
          </button>
        </form>
      </Modal>
    </>
  );
}
