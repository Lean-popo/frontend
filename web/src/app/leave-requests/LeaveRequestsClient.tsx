"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Calendar
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LeaveRequestsClient({ initialRequests }: { initialRequests: any[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const router = useRouter();

  const userString = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = userString ? JSON.parse(userString) : null;
  const isManagerOrAdmin = user?.role === "Admin" || user?.role === "Manager";

  const handleStatusUpdate = async (request: any, status: number) => {
    if (!isManagerOrAdmin) {
      alert("Bạn không có quyền thực hiện hành động này.");
      return;
    }
    try {
      await api.updateLeaveRequest(request.id, {
        ...request,
        status: status
      });
      // Update local state
      setRequests(requests.map(r => r.id === request.id ? { ...r, status } : r));
      router.refresh();
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái: " + error);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight font-outfit">Đơn Nghỉ Phép</h1>
          <p className="text-slate-500 mt-2">Quản lý và phê duyệt các yêu cầu nghỉ phép của nhân viên.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {requests.map((request: any) => (
          <div key={request.id} className="glass p-6 rounded-3xl flex items-center justify-between group hover:border-indigo-200 transition-all">
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                request.status === 0 ? 'bg-amber-50 text-amber-500' :
                request.status === 1 ? 'bg-emerald-50 text-emerald-500' :
                'bg-rose-50 text-rose-500'
              }`}>
                {request.status === 0 ? <Clock size={28} /> :
                 request.status === 1 ? <CheckCircle2 size={28} /> :
                 <XCircle size={28} />}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">{request.user?.fullName}</span>
                  <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    request.status === 0 ? 'bg-amber-100 text-amber-600' :
                    request.status === 1 ? 'bg-emerald-100 text-emerald-600' :
                    'bg-rose-100 text-rose-600'
                  }`}>
                    {request.status === 0 ? 'Chờ duyệt' : request.status === 1 ? 'Đã duyệt' : 'Từ chối'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(request.leaveDate).toLocaleDateString('vi-VN')}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText size={14} />
                    {request.reason}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {request.status === 0 && isManagerOrAdmin && (
                <>
                  <button 
                    onClick={() => handleStatusUpdate(request, 2)}
                    className="px-4 py-2 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    Từ chối
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(request, 1)}
                    className="px-4 py-2 text-sm font-bold bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-100 hover:scale-105 transition-all"
                  >
                    Phê duyệt
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
