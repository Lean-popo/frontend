import { api } from "@/lib/api";
import UsersClient from "./UsersClient";

export default async function UsersPage() {
  const [users, roles, shifts] = await Promise.all([
    api.getUsers(),
    api.getRoles(),
    api.getShifts()
  ]);

  return <UsersClient initialUsers={users} roles={roles} shifts={shifts} />;
}
