const API_BASE_URL = "http://localhost:5243/api";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });
  
  if (response.status === 204) return null;
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Failed to fetch ${endpoint}`);
  }
  return response.json();
}

export const api = {
  // Users
  getUsers: () => fetchApi("/Users"),
  createUser: (data: any) => fetchApi("/Users", { method: "POST", body: JSON.stringify(data) }),
  updateUser: (id: number, data: any) => fetchApi(`/Users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteUser: (id: number) => fetchApi(`/Users/${id}`, { method: "DELETE" }),

  // Attendances
  getAttendances: () => fetchApi("/Attendances"),
  createAttendance: (data: any) => fetchApi("/Attendances", { method: "POST", body: JSON.stringify(data) }),
  updateAttendance: (id: number, data: any) => fetchApi(`/Attendances/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  // Payrolls
  getPayrolls: () => fetchApi("/Payrolls"),
  createPayroll: (data: any) => fetchApi("/Payrolls", { method: "POST", body: JSON.stringify(data) }),

  // Leave Requests
  getLeaveRequests: () => fetchApi("/LeaveRequests"),
  createLeaveRequest: (data: any) => fetchApi("/LeaveRequests", { method: "POST", body: JSON.stringify(data) }),
  updateLeaveRequest: (id: number, data: any) => fetchApi(`/LeaveRequests/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  // General
  getShifts: () => fetchApi("/Shifts"),
  getRoles: () => fetchApi("/Roles"),
  getProducts: () => fetchApi("/Products"),
  getCategories: () => fetchApi("/Categories"),
  getConfigs: () => fetchApi("/Configs"),
  updateConfig: (key: string, data: any) => fetchApi(`/Configs/${key}`, { method: "PUT", body: JSON.stringify(data) }),
};
