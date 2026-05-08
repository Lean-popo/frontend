"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, UserMinus, Download, Trash2, CheckCircle, Clock, Pencil, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { api } from "@/lib/api";

const initialResignations = [
  { id: 1, employee: "Phạm Thị Dung", date: "2026-04-30", reason: "Chuyển công tác", status: "Đã duyệt" },
  { id: 2, employee: "Hoàng Minh Đức", date: "2026-05-15", reason: "Việc gia đình", status: "Chờ duyệt" },
];

export default function ResignationPage() {
  const [resignations, setResignations] = useState(initialResignations);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    employee: "",
    date: new Date().toISOString().split('T')[0],
    reason: "",
    status: "Chờ duyệt"
  });

  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.getUsers();
        setUsers(data);
        if (data.length > 0 && !formData.employee) {
          setFormData(prev => ({ ...prev, employee: data[0].fullName }));
        }
      } catch (error: any) {
        console.error("Failed to fetch users:", error);
        if (error.message.includes("401") || error.message.includes("Unauthorized")) {
          router.push("/login");
        }
      }
    };
    fetchUsers();
  }, [router]);

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({
        employee: "",
        date: new Date().toISOString().split('T')[0],
        reason: "",
        status: "Chờ duyệt"
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setResignations(resignations.map(r => r.id === editingItem.id ? { ...formData, id: r.id } : r));
    } else {
      setResignations([...resignations, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa đơn thôi việc này?")) {
      setResignations(resignations.filter(r => r.id !== id));
    }
  };

  const filteredResignations = resignations.filter(r => 
    r.employee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200 gap-8">
        <button className="px-4 py-2 border-b-2 border-primary text-primary font-bold text-sm">
          Quản lý thôi việc
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Tìm kiếm</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên nhân viên..." 
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
            Tạo đơn thôi việc
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
              <th className="p-4 font-bold text-slate-700">Ngày thôi việc dự kiến</th>
              <th className="p-4 font-bold text-slate-700">Lý do</th>
              <th className="p-4 font-bold text-slate-700">Trạng thái</th>
              <th className="p-4 w-10 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredResignations.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                <td className="p-4 font-bold text-slate-900">{item.employee}</td>
                <td className="p-4 text-slate-600">{item.date}</td>
                <td className="p-4 text-slate-600">{item.reason}</td>
                <td className="p-4">
                  <div className={`flex items-center gap-1.5 font-bold text-[11px] uppercase ${item.status === "Đã duyệt" ? "text-emerald-600" : "text-amber-600"}`}>
                    {item.status === "Đã duyệt" ? <CheckCircle size={14} /> : <Clock size={14} />}
                    {item.status}
                  </div>
                </td>
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
        title={editingItem ? "Chỉnh sửa đơn thôi việc" : "Tạo đơn thôi việc mới"}
      >
        <form onSubmit={handleSave} className="space-y-4 p-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Nhân viên</label>
            <select 
              required
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-primary outline-none"
              value={formData.employee}
              onChange={(e) => setFormData({...formData, employee: e.target.value})}
            >
              <option value="" disabled>Chọn nhân viên</option>
              {users.map(user => (
                <option key={user.id} value={user.fullName}>
                  {user.fullName}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Ngày dự kiến</label>
              <input 
                type="date"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-primary outline-none"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Trạng thái</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-primary outline-none"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="Chờ duyệt">Chờ duyệt</option>
                <option value="Đã duyệt">Đã duyệt</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Lý do thôi việc</label>
            <textarea 
              required
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-primary outline-none min-h-[80px]"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              placeholder="Nhập lý do thôi việc..."
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded text-sm font-bold mt-4 transition-colors"
          >
            {editingItem ? "Cập nhật" : "Tạo đơn"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
