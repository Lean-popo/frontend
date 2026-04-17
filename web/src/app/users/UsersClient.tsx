"use client";

import { useState, useMemo } from "react";
import { api } from "@/lib/api";
import { 
  Plus,
  Shield,
  Phone,
  Calendar,
  Pencil,
  Trash2,
  Search,
  Filter,
  UserCheck,
  UserX,
  BadgeCheck,
  User as UserIcon
} from "lucide-react";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function UsersClient({ initialUsers, roles }: { initialUsers: any[], roles: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    passwordHash: "default_password",
    phone: "",
    status: 0,
    roleId: roles[0]?.id || 1
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
      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);

  const handleOpenModal = (user?: any) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        fullName: user.fullName,
        passwordHash: "default_password", // Don't show hash
        phone: user.phone || "",
        status: user.status,
        roleId: user.userRoles?.[0]?.roleId || roles[0]?.id || 1
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        fullName: "",
        passwordHash: "default_password",
        phone: "",
        status: 0,
        roleId: roles[0]?.id || 1
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
        userRoles: [{ roleId: formData.roleId }]
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
      alert("Lỗi khi lưu nhân viên: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) return;
    try {
      await api.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      alert("Lỗi khi xóa nhân viên: " + error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight font-outfit">Nhân Viên</h1>
          <p className="text-slate-500 mt-2">Quản lý tài khoản, phân quyền và thông tin hồ sơ.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 premium-gradient text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={18} />
          Thêm Nhân Viên
        </button>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Tìm kiếm theo tên hoặc tài khoản..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 outline-none appearance-none font-medium text-sm cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </div>
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredUsers.map((user: any) => (
            <motion.div 
              key={user.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="glass p-6 rounded-[2rem] hover:translate-y-[-4px] transition-all duration-300 group relative border border-white/50 dark:border-slate-800/50"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                    {user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center ${user.status === 0 ? "bg-emerald-500" : "bg-slate-400"}`}>
                    {user.status === 0 ? <UserCheck size={10} className="text-white" /> : <UserX size={10} className="text-white" />}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  <button 
                    onClick={() => handleOpenModal(user)}
                    className="p-2.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-500 rounded-xl transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="p-2.5 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500 rounded-xl transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold tracking-tight">{user.fullName}</h3>
                    {user.userRoles?.[0]?.role?.roleName === 'Admin' && (
                      <BadgeCheck size={16} className="text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-slate-500 font-medium">@{user.username}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {user.userRoles?.map((ur: any) => (
                    <span 
                      key={ur.roleId} 
                      className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-indigo-100 dark:border-indigo-800"
                    >
                      {ur.role?.roleName === 'Admin' ? 'Quản trị' : ur.role?.roleName === 'Manager' ? 'Quản lý' : 'Nhân viên'}
                    </span>
                  )) || (
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-full">
                      Chưa có chức vụ
                    </span>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-indigo-500">
                      <Phone size={14} />
                    </div>
                    <span className="font-medium">{user.phone || "Không có SĐT"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-indigo-500">
                      <Calendar size={14} />
                    </div>
                    <span className="font-medium">Ngày gia nhập {new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingUser ? "Chỉnh Sửa Nhân Viên" : "Thêm Nhân Viên Mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-5 p-2">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <UserIcon size={40} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Họ và Tên</label>
            <input 
              required
              className="w-full px-5 py-4 rounded-2xl border-none bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              placeholder="VD: Nguyễn Văn A"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Tên tài khoản</label>
              <input 
                required
                className="w-full px-5 py-4 rounded-2xl border-none bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="nguyenvana"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Số điện thoại</label>
              <input 
                className="w-full px-5 py-4 rounded-2xl border-none bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="09xx..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Chức vụ</label>
              <select 
                className="w-full px-5 py-4 rounded-2xl border-none bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium appearance-none cursor-pointer"
                value={formData.roleId}
                onChange={(e) => setFormData({...formData, roleId: parseInt(e.target.value)})}
              >
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.roleName === 'Admin' ? 'Quản trị' : role.roleName === 'Manager' ? 'Quản lý' : 'Nhân viên'}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Trạng thái</label>
              <select 
                className="w-full px-5 py-4 rounded-2xl border-none bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium appearance-none cursor-pointer"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: parseInt(e.target.value)})}
              >
                <option value={0}>Đang hoạt động</option>
                <option value={1}>Ngừng hoạt động</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 premium-gradient text-white rounded-[1.5rem] font-bold shadow-xl shadow-indigo-100 dark:shadow-none mt-4 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Đang lưu..." : (editingUser ? "Cập Nhật Nhân Viên" : "Tạo Nhân Viên")}
          </button>
        </form>
      </Modal>
    </div>
  );
}
