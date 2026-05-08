"use client";

import { usePathname } from "next/navigation";
import { ChevronRight, Home, Settings, Bell, Search } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();
  
  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(p => p);
    return paths.map((p, i) => ({
      name: p.charAt(0).toUpperCase() + p.slice(1).replace("-", " "),
      href: "/" + paths.slice(0, i + 1).join("/")
    }));
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="flex items-center text-slate-400">
          <Link href="/dashboard" className="hover:text-primary transition-colors">
            <Home size={16} />
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <div key={crumb.href} className="flex items-center">
              <ChevronRight size={14} className="mx-2" />
              <Link 
                href={crumb.href} 
                className={`text-sm font-medium hover:text-primary transition-colors ${i === breadcrumbs.length - 1 ? "text-slate-900" : ""}`}
              >
                {crumb.name}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="pl-10 pr-4 py-1.5 bg-slate-100 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none w-64 transition-all"
          />
        </div>
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
          <Settings size={20} />
        </button>
        <div className="h-8 w-px bg-slate-200 mx-1"></div>
        <div className="flex items-center gap-3 ml-2 group cursor-pointer" onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }}>
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
            A
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-slate-900 leading-none">Admin</p>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">Đăng xuất</p>
          </div>
        </div>
      </div>
    </header>
  );
}
