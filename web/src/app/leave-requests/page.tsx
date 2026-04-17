import { api } from "@/lib/api";
import LeaveRequestsClient from "./LeaveRequestsClient";

export default async function LeaveRequestsPage() {
  const requests = await api.getLeaveRequests();

  return <LeaveRequestsClient initialRequests={requests} />;
}
