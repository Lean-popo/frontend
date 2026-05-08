"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Users, 
  Fingerprint, 
  CalendarClock, 
  Calculator,
  ChevronDown,
  ChevronRight,
  List,
  Award,
  UserMinus,
  Settings,
  LogOut
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MenuItem {
  name: string;
  icon: any;
  href?: string;
  subItems?: { name: string; href: string; icon?: any }[];
}

const menuItems: MenuItem[] = [
  { name: "Trang chủ", icon: Home, href: "/dashboard" },
  { 
    name: "Quản lý nhân sự", 
    icon: Users, 
    subItems: [
      { name: "Danh sách nhân viên", href: "/users", icon: List },
      { name: "Quản lý khen thưởng/kỷ luật", href: "/rewards", icon: Award },
      { name: "Quản lý thôi việc", href: "/resignation", icon: UserMinus },
    ]
  },
  { name: "Quản lý chấm công", icon: CalendarClock, href: "/attendances" },
  { name: "Tính lương", icon: Calculator, href: "/payrolls" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Quản lý nhân sự"]);

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  return (
    <aside className="w-64 bg-[#004d4a] text-white flex flex-col h-screen sticky top-0 z-50">
      <div className="h-14 flex items-center px-6 bg-[#006d69] font-bold text-lg tracking-wider border-b border-[#004d4a]/20">
        TIME365
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => {
          const isExpanded = expandedItems.includes(item.name);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isActive = pathname === item.href || item.subItems?.some(si => pathname === si.href);

          return (
            <div key={item.name} className="px-2 mb-1">
              {hasSubItems ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors group",
                      isActive ? "bg-[#006d69] text-white" : "hover:bg-[#006d69]/50 text-emerald-50/70 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden ml-4 mt-1 space-y-1"
                      >
                        {item.subItems?.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className={cn(
                                "flex items-center gap-3 px-4 py-2 rounded-lg text-xs transition-colors",
                                isSubActive ? "text-white font-bold" : "text-emerald-50/50 hover:text-white hover:bg-[#006d69]/30"
                              )}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-50/30" />
                              <span>{sub.name}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href={item.href || "#"}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors",
                    pathname === item.href ? "bg-[#006d69] text-white shadow-inner" : "hover:bg-[#006d69]/50 text-emerald-50/70 hover:text-white"
                  )}
                >
                  <item.icon size={20} />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#006d69]/30">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold">Quản trị viên</span>
            <span className="text-[10px] text-emerald-50/50">Admin Account</span>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-emerald-50/50 hover:text-white hover:bg-[#006d69]/30 transition-colors text-sm">
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
