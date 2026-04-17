import { api } from "@/lib/api";
import AttendancesClient from "./AttendancesClient";

export default async function AttendancesPage() {
  const [attendances, users, shifts] = await Promise.all([
    api.getAttendances(),
    api.getUsers(),
    api.getShifts(),
  ]);

  return (
    <AttendancesClient 
      initialAttendances={attendances} 
      users={users} 
      shifts={shifts} 
    />
  );
}
