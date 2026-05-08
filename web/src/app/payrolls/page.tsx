import { api } from "@/lib/api";
import PayrollsClient from "./PayrollsClient";

export default async function PayrollsPage() {
  const [payrolls, users, attendances] = await Promise.all([
    api.getPayrolls(),
    api.getUsers(),
    api.getAttendances(),
  ]);

  return <PayrollsClient initialPayrolls={payrolls} users={users} attendances={attendances} />;
}
