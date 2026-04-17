"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  Wallet, 
  FileText, 
  Settings,
  Coffee
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useConfig } from "./ConfigContext";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const menuItems = [
  { name: "Bảng điều khiển", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Chấm công", icon: CalendarCheck, href: "/attendances" },
  { name: "Bảng lương", icon: Wallet, href: "/payrolls" },
  { name: "Nghỉ phép", icon: FileText, href: "/leave-requests" },
  { name: "Nhân viên", icon: Users, href: "/users" },
  { name: "Cài đặt", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { shopName } = useConfig();

  // Hide sidebar on the landing page
  if (pathname === "/") return null;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass border-r z-50 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center text-white shadow-lg">
          <Coffee size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight font-outfit uppercase">{shopName}</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard");
          const href = item.href;
          
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-200 dark:shadow-none" 
                  : "hover:bg-indigo-50 text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-white" : "group-hover:text-indigo-500")} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
        
        {/* Link back to Live Site */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 text-emerald-600 transition-all duration-200"
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Xem Trang Chủ</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="User" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Quản Trị Viên</span>
            <span className="text-xs text-slate-500">Hệ thống</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
