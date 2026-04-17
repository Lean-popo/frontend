"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <div className="flex min-h-screen">
      {!isLandingPage && <Sidebar />}
      <main className={isLandingPage 
        ? "flex-1 min-h-screen" 
        : "flex-1 ml-64 p-8 min-h-screen bg-[#f8fafc] dark:bg-[#020617]"
      }>
        <div className={isLandingPage ? "" : "max-w-7xl mx-auto"}>
          {children}
        </div>
      </main>
    </div>
  );
}
