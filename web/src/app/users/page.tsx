"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import UsersClient from "./UsersClient";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, roles, shifts] = await Promise.all([
          api.getUsers(),
          api.getRoles(),
          api.getShifts()
        ]);
        setData({ users, roles, shifts });
      } catch (err: any) {
        console.error(err);
        if (err.message.includes("401") || err.message.includes("Unauthorized")) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
        <p className="font-medium">Đang tải danh sách nhân viên...</p>
      </div>
    );
  }

  if (!data) return null;

  return <UsersClient initialUsers={data.users} roles={data.roles} shifts={data.shifts} />;
}
