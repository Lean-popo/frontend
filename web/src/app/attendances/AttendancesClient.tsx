"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { 
  Search, 
  Filter, 
  Download,
  Plus,
  Pencil,
  Trash2
} from "lucide-react";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";

export default function AttendancesClient({ 
  initialAttendances,
  users,
  shifts
}: { 
  initialAttendances: any[],
  users: any[],
  shifts: any[]
}) {
  const [attendances, setAttendances] = useState(initialAttendances);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    userId: users[0]?.id || 0,
    shiftId: shifts[0]?.id || 0,
    checkIn: new Date().toISOString().slice(0, 16),
    checkOut: "",
    status: 0
  });

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        userId: item.userId,
        shiftId: item.shiftId,
        checkIn: item.checkIn ? new Date(item.checkIn).toISOString().slice(0, 16) : "",
        checkOut: item.checkOut ? new Date(item.checkOut).toISOString().slice(0, 16) : "",
        status: item.status
      });
    } else {
      setEditingItem(null);
      setFormData({
        userId: users[0]?.id || 0,
        shiftId: shifts[0]?.id || 0,
        checkIn: new Date().toISOString().slice(0, 16),
        checkOut: "",
        status: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingItem) {
        await api.updateAttendance(editingItem.id, { ...formData, id: editingItem.id });
      } else {
        await api.createAttendance(formData);
      }
      setIsModalOpen(false);
      const updated = await api.getAttendances();
      setAttendances(updated);
      router.refresh();
    } catch (error) {
      alert("Lỗi khi lưu: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bản ghi chấm công này?")) return;
    
    setLoading(true);
    try {
      await api.deleteAttendance(id);
      const updated = await api.getAttendances();
      setAttendances(updated);
      router.refresh();
    } catch (error) {
      alert("Lỗi khi xóa: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight font-outfit">Chấm Công</h1>
          <p className="text-slate-500 mt-2">Quản lý và theo dõi lịch sử chấm công của nhân viên.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors">
            <Download size={18} />
            Xuất CSV
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 premium-gradient text-white rounded-xl font-medium text-sm shadow-lg shadow-indigo-200"
          >
            <Plus size={18} />
            Điểm Danh
          </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm nhân viên..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Nhân viên</th>
                <th className="px-6 py-4">Ngày</th>
                <th className="px-6 py-4">Ca làm</th>
                <th className="px-6 py-4">Giờ vào</th>
                <th className="px-6 py-4">Giờ ra</th>
                <th className="px-6 py-4 text-center">Số giờ</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {attendances.map((item: any) => (
                <tr key={item.id} className="hover:bg-indigo-50/30 dark:hover:hover:bg-indigo-900/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                        {item.user?.fullName?.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <span className="font-semibold text-sm">{item.user?.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {item.checkIn ? new Date(item.checkIn).toLocaleDateString('vi-VN') : "---"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wide">
                      {item.shift?.shiftName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {item.checkIn ? new Date(item.checkIn).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }) : "---"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {item.checkOut ? new Date(item.checkOut).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }) : "---"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.checkIn && item.checkOut ? (
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-bold">
                        {((new Date(item.checkOut).getTime() - new Date(item.checkIn).getTime()) / (1000 * 60 * 60)).toFixed(1)}h
                      </span>
                    ) : "---"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      item.status === 0 ? 'bg-emerald-100 text-emerald-600' :
                      item.status === 1 ? 'bg-amber-100 text-amber-600' :
                      'bg-rose-100 text-rose-600'
                    }`}>
                      {item.status === 0 ? 'Đúng giờ' : item.status === 1 ? 'Muộn' : 'Vắng mặt'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(item)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-500 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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
        title={editingItem ? "Chỉnh sửa chấm công" : "Ghi nhận chấm công"}
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
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">Ca làm</label>
            <select 
              required
              className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
              value={formData.shiftId}
              onChange={(e) => setFormData({...formData, shiftId: parseInt(e.target.value)})}
            >
              {shifts.map(s => <option key={s.id} value={s.id}>{s.shiftName}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">Thời gian vào ca</label>
            <input 
              type="datetime-local"
              required
              className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
              value={formData.checkIn}
              onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">Thời gian tan ca</label>
            <input 
              type="datetime-local"
              className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
              value={formData.checkOut}
              onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">Trạng thái</label>
            <select 
              className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: parseInt(e.target.value)})}
            >
              <option value={0}>Đúng giờ</option>
              <option value={1}>Muộn</option>
              <option value={2}>Vắng mặt</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 premium-gradient text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 mt-6 disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Lưu bản ghi"}
          </button>
        </form>
      </Modal>
    </>
  );
}
