"use client";

import { useState, useMemo } from "react";
import { api } from "@/lib/api";
import { 
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Settings
} from "lucide-react";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";

export default function UsersClient({ initialUsers, roles, shifts }: { initialUsers: any[], roles: any[], shifts: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    passwordHash: "default_password",
    phone: "",
    status: 0,
    roleId: roles[0]?.id || 1,
    shiftId: shifts[0]?.id || 1,
    createdAt: new Date().toISOString().split('T')[0]
  });

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "active" && user.status === 0) ||
        (statusFilter === "inactive" && user.status === 1);
      const matchesRole =
        roleFilter === "all" ||
        user.userRoles?.[0]?.roleId.toString() === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id: number) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleOpenModal = (user?: any) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        fullName: user.fullName,
        passwordHash: "default_password",
        phone: user.phone || "",
        status: user.status,
        roleId: user.userRoles?.[0]?.roleId || roles[0]?.id || 1,
        shiftId: user.shiftAssignments?.[0]?.shiftId || shifts[0]?.id || 1,
        createdAt: new Date(user.createdAt).toISOString().split('T')[0]
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        fullName: "",
        passwordHash: "default_password",
        phone: "",
        status: 0,
        roleId: roles[0]?.id || 1,
        shiftId: shifts[0]?.id || 1,
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        userRoles: [{ roleId: formData.roleId }],
        shiftAssignments: [{ shiftId: formData.shiftId }]
      };

      if (editingUser) {
        await api.updateUser(editingUser.id, { ...payload, id: editingUser.id });
      } else {
        await api.createUser(payload);
      }
      setIsModalOpen(false);
      const updatedUsers = await api.getUsers();
      setUsers(updatedUsers);
      router.refresh();
    } catch (error) {
      alert("Lỗi: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) return;
    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedUsers.length} nhân viên đã chọn?`)) return;
    
    try {
      setLoading(true);
      await Promise.all(selectedUsers.map(id => api.deleteUser(id)));
      setUsers(users.filter(u => !selectedUsers.includes(u.id)));
      setSelectedUsers([]);
    } catch (error) {
      alert("Lỗi khi xóa: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-8">
        <button className="px-4 py-2 border-b-2 border-primary text-primary font-bold text-sm">
          Danh sách nhân viên
        </button>
        <button className="px-4 py-2 text-slate-400 font-medium text-sm hover:text-slate-600">
          Trang chủ
        </button>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Nhân viên</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm nhân viên" 
              className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded text-sm focus:border-primary outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Chức vụ</label>
          <select 
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-primary outline-none"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.roleName}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Trạng thái làm việc</label>
          <select 
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-primary outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 rounded text-sm font-bold transition-colors flex items-center justify-center gap-2">
            <Search size={16} />
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button 
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded text-sm font-bold transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Thêm nhân viên
          </button>
          <button 
            onClick={handleDeleteSelected}
            disabled={selectedUsers.length === 0}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 size={16} />
            Xóa nhân viên
          </button>
          <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded text-sm font-bold transition-colors flex items-center gap-2">
            <Download size={16} />
            Báo cáo Excel
          </button>
        </div>
        
        <div className="p-2 bg-primary rounded text-white cursor-pointer hover:bg-primary-dark transition-colors">
          <Settings size={16} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 w-10">
                  <input 
                    type="checkbox" 
                    className="accent-primary"
                    onChange={handleSelectAll}
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  />
                </th>
                <th className="p-4 font-bold text-slate-700">Mã nhân viên</th>
                <th className="p-4 font-bold text-slate-700">Họ và tên</th>
                <th className="p-4 font-bold text-slate-700">Mã chấm công</th>
                <th className="p-4 font-bold text-slate-700">Ca làm việc</th>
                <th className="p-4 font-bold text-slate-700">Nhóm làm việc</th>
                <th className="p-4 font-bold text-slate-700">Ngày vào làm</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: any) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      className="accent-primary"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td className="p-4 font-bold text-slate-600">
                    {user.id.toString().padStart(8, '0')}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                        <img src={`https://ui-avatars.com/api/?name=${user.fullName}&background=random`} alt="" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{user.fullName}</span>
                        <div className="flex flex-col text-[11px] text-slate-500">
                          <span className="flex items-center gap-1"><Mail size={10} /> {user.username}@company.com</span>
                          <span className="flex items-center gap-1"><Phone size={10} /> {user.phone || "---"}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">
                    {user.id.toString().padStart(4, '0')}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.shiftAssignments?.[0]?.shift?.shiftName === 'Tối' ? "bg-indigo-100 text-indigo-700" : "bg-orange-100 text-orange-700"}`}>
                      {user.shiftAssignments?.[0]?.shift?.shiftName || "Sáng"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">
                    {user.userRoles?.[0]?.role?.roleName || "Nhân viên"}
                  </td>
                  <td className="p-4 text-slate-900 font-bold">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleOpenModal(user)}
                      className="p-1 hover:bg-slate-200 rounded text-slate-400 group-hover:text-slate-600 transition-all"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex items-center justify-between border-t border-slate-200 bg-slate-50/50">
          <span className="text-xs text-slate-500">Hiển thị {filteredUsers.length} trên {users.length} nhân viên</span>
          <div className="flex items-center gap-2">
            <button className="p-1.5 border border-slate-300 rounded hover:bg-white disabled:opacity-30" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded text-xs font-bold">
              1
            </button>
            <button className="p-1.5 border border-slate-300 rounded hover:bg-white">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingUser ? "Chỉnh sửa nhân viên" : "Thêm nhân viên"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 p-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Họ và tên</label>
            <input 
              required
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-primary outline-none"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Tên tài khoản</label>
              <input 
                required
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-primary outline-none"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Số điện thoại</label>
              <input 
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-primary outline-none"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Chức vụ</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-primary outline-none"
                value={formData.roleId}
                onChange={(e) => setFormData({...formData, roleId: parseInt(e.target.value)})}
              >
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.roleName}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Trạng thái</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-primary outline-none"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: parseInt(e.target.value)})}
              >
                <option value={0}>Đang hoạt động</option>
                <option value={1}>Ngừng hoạt động</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Ca làm việc</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-primary outline-none"
                value={formData.shiftId}
                onChange={(e) => setFormData({...formData, shiftId: parseInt(e.target.value)})}
              >
                {shifts.map(s => (
                  <option key={s.id} value={s.id}>{s.shiftName}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Ngày vào làm</label>
              <input 
                type="date"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-primary outline-none"
                value={formData.createdAt}
                onChange={(e) => setFormData({...formData, createdAt: e.target.value})}
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded text-sm font-bold mt-4 transition-colors"
          >
            {loading ? "Đang lưu..." : "Lưu thông tin"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
