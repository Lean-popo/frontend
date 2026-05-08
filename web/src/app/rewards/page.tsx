"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Award, AlertCircle, Download, Trash2, Settings, Pencil, MoreVertical } from "lucide-react";
import Modal from "@/components/Modal";
import { api } from "@/lib/api";

export default function RewardsPage() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    userId: 0,
    type: "Khen thưởng",
    reason: "",
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  });

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, rewardsData] = await Promise.all([
          api.getUsers(),
          api.getRewards()
        ]);
        setEmployees(usersData || []);
        setRewards(rewardsData || []);
        if (usersData.length > 0) {
          setFormData(prev => ({ ...prev, userId: usersData[0].id }));
        }
      } catch (error: any) {
        console.error("Failed to fetch data:", error);
        if (error.message.includes("401") || error.message.includes("Unauthorized")) {
          router.push("/login");
        }
      }
    };
    fetchData();
  }, [router]);

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        userId: item.userId,
        type: item.type,
        reason: item.reason,
        amount: item.amount,
        date: new Date(item.date).toISOString().split('T')[0]
      });
    } else {
      setEditingItem(null);
      setFormData({
        userId: employees[0]?.id || 0,
        type: "Khen thưởng",
        reason: "",
        amount: 0,
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateReward(editingItem.id, { ...formData, id: editingItem.id });
      } else {
        await api.createReward(formData);
      }
      setIsModalOpen(false);
      const data = await api.getRewards();
      setRewards(data);
    } catch (error) {
      alert("Lỗi khi lưu: " + error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bản ghi này?")) return;
    try {
      await api.deleteReward(id);
      const data = await api.getRewards();
      setRewards(data);
    } catch (error) {
      alert("Lỗi khi xóa: " + error);
    }
  };

  const filteredRewards = rewards.filter(r => 
    r.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200 gap-8">
        <button className="px-4 py-2 border-b-2 border-primary text-primary font-bold text-sm">
          Quản lý khen thưởng/kỷ luật
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Tìm kiếm</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên nhân viên hoặc lý do..." 
              className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded text-sm focus:border-primary outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
        </div>
        <div className="flex items-end gap-2">
          <button className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 rounded text-sm font-bold transition-colors flex items-center justify-center gap-2">
            <Search size={16} />
            Tìm kiếm
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button 
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded text-sm font-bold transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Thêm mới
          </button>
          <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded text-sm font-bold transition-colors flex items-center gap-2">
            <Download size={16} />
            Báo cáo Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-bold text-slate-700">Nhân viên</th>
              <th className="p-4 font-bold text-slate-700">Loại</th>
              <th className="p-4 font-bold text-slate-700">Lý do</th>
              <th className="p-4 font-bold text-slate-700">Số tiền</th>
              <th className="p-4 font-bold text-slate-700">Ngày quyết định</th>
              <th className="p-4 w-10 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredRewards.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                <td className="p-4 font-bold text-slate-900">{item.user?.fullName}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${item.type === "Khen thưởng" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                    {item.type}
                  </span>
                </td>
                <td className="p-4 text-slate-600">{item.reason}</td>
                <td className={`p-4 font-bold ${item.type === "Khen thưởng" ? "text-emerald-600" : "text-rose-600"}`}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.amount)}
                </td>
                <td className="p-4 text-slate-600">{new Date(item.date).toLocaleDateString('vi-VN')}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenModal(item)}
                      className="p-1 hover:bg-amber-100 text-amber-600 rounded transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-1 hover:bg-rose-100 text-rose-600 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Chỉnh sửa khen thưởng/kỷ luật" : "Thêm mới khen thưởng/kỷ luật"}
      >
        <form onSubmit={handleSave} className="space-y-4 p-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Nhân viên</label>
            <select 
              required
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-primary outline-none"
              value={formData.userId}
              onChange={(e) => setFormData({...formData, userId: parseInt(e.target.value)})}
            >
              <option value={0} disabled>-- Chọn nhân viên --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.username})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Loại</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-primary outline-none"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Khen thưởng">Khen thưởng</option>
                <option value="Kỷ luật">Kỷ luật</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Số tiền</label>
              <input 
                type="number"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-primary outline-none"
                value={formData.amount || ""}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setFormData({...formData, amount: isNaN(val) ? 0 : val});
                }}
                placeholder="VD: 500000"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Lý do</label>
            <textarea 
              required
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-primary outline-none min-h-[80px]"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              placeholder="Nhập lý do cụ thể..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Ngày quyết định</label>
            <input 
              type="date"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-primary outline-none"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded text-sm font-bold mt-4 transition-colors"
          >
            {editingItem ? "Cập nhật" : "Thêm mới"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
