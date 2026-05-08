"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import PayrollsClient from "./PayrollsClient";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PayrollsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataString = localStorage.getItem("user");
        const userObj = userDataString ? JSON.parse(userDataString) : null;
        const canViewUsers = userObj?.role === "Admin" || userObj?.role === "Manager";

        const [payrolls, users, attendances] = await Promise.all([
          api.getPayrolls(),
          canViewUsers ? api.getUsers() : Promise.resolve([]),
          api.getAttendances(),
        ]);
        setData({ payrolls, users, attendances });
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
        <p className="font-medium">Đang tải danh sách lương...</p>
      </div>
    );
  }

  if (!data) return null;

  return <PayrollsClient initialPayrolls={data.payrolls} users={data.users} attendances={data.attendances} />;
}
