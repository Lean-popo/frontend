import { api } from "@/lib/api";
import UsersClient from "./UsersClient";

export default async function UsersPage() {
  const [users, roles] = await Promise.all([
    api.getUsers(),
    api.getRoles()
  ]);

  return <UsersClient initialUsers={users} roles={roles} />;
}
