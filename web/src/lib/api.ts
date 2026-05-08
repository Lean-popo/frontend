const API_BASE_URL = "http://127.0.0.1:5044/api";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 204) return null;
    if (!response.ok) {
      const error = await response.text();
      console.error(`API Error [${endpoint}]:`, error);
      throw new Error(error || `Failed to fetch ${endpoint}`);
    }
    return response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error(`API Timeout [${endpoint}] after 10s`);
      throw new Error(`Connection timeout when calling ${endpoint}`);
    }
    console.error(`Fetch error [${endpoint}]:`, error.message);
    throw error;
  }
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
  deleteAttendance: (id: number) => fetchApi(`/Attendances/${id}`, { method: "DELETE" }),

  // Payrolls
  getPayrolls: () => fetchApi("/Payrolls"),
  createPayroll: (data: any) => fetchApi("/Payrolls", { method: "POST", body: JSON.stringify(data) }),
  updatePayroll: (id: number, data: any) => fetchApi(`/Payrolls/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePayroll: (id: number) => fetchApi(`/Payrolls/${id}`, { method: "DELETE" }),

  // Rewards
  getRewards: () => fetchApi("/Rewards"),
  createReward: (data: any) => fetchApi("/Rewards", { method: "POST", body: JSON.stringify(data) }),
  updateReward: (id: number, data: any) => fetchApi(`/Rewards/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteReward: (id: number) => fetchApi(`/Rewards/${id}`, { method: "DELETE" }),

  // General
  getShifts: () => fetchApi("/Shifts"),
  getRoles: () => fetchApi("/Roles"),
  getConfigs: () => fetchApi("/Configs"),
  updateConfig: (key: string, data: any) => fetchApi(`/Configs/${key}`, { method: "PUT", body: JSON.stringify(data) }),
};
