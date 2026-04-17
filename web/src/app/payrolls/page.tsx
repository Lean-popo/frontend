import { api } from "@/lib/api";
import PayrollsClient from "./PayrollsClient";

export default async function PayrollsPage() {
  const [payrolls, users] = await Promise.all([
    api.getPayrolls(),
    api.getUsers(),
  ]);

  return <PayrollsClient initialPayrolls={payrolls} users={users} />;
}
