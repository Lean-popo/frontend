"use client";

import { useState, useEffect } from "react";
import { useConfig } from "@/components/ConfigContext";
import { Settings as SettingsIcon, Lock, Globe, Save } from "lucide-react";

export default function SettingsPage() {
  const { shopName, setShopName, refreshConfigs } = useConfig();
  const [tempName, setTempName] = useState(shopName);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setTempName(shopName);
  }, [shopName]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await setShopName(tempName);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert("Lỗi khi lưu cài đặt: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-4xl font-bold tracking-tight font-outfit">Cài Đặt</h1>
        <p className="text-slate-500 mt-2">Quản lý cấu hình hệ thống và tùy chỉnh cá nhân.</p>
      </header>

      <div className="max-w-4xl space-y-6">
        <section className="glass p-8 rounded-[2rem]">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <SettingsIcon size={20} className="text-indigo-500" />
            Cấu Hình Chung
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl gap-4">
              <div>
                <p className="font-bold">Tên quán cà phê</p>
                <p className="text-sm text-slate-500">Tên hiển thị trên hóa đơn và trang chủ.</p>
              </div>
              <input 
                type="text" 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 font-medium"
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl gap-4">
              <div>
                <p className="font-bold">Ngôn ngữ hệ thống</p>
                <p className="text-sm text-slate-500">Chọn ngôn ngữ mặc định cho giao diện.</p>
              </div>
              <select className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 font-medium appearance-none">
                <option>Tiếng Việt</option>
                <option>English</option>
              </select>
            </div>
          </div>
        </section>

        <section className="glass p-8 rounded-[2rem]">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Lock size={20} className="text-rose-500" />
            Bảo Mật
          </h3>
          <button className="px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl font-bold hover:bg-rose-100 transition-colors">
            Đổi mật khẩu quản trị
          </button>
        </section>

        <div className="flex items-center justify-end gap-4">
          {success && (
            <span className="text-emerald-500 font-bold animate-in fade-in slide-in-from-right-4">
              Đã lưu thành công!
            </span>
          )}
          <button 
            onClick={() => setTempName(shopName)}
            className="px-8 py-4 bg-white border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-4 premium-gradient text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Đang lưu..." : (
              <>
                <Save size={20} />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
