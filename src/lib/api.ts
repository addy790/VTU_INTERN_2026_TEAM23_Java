const BASE_URL = "http://localhost:8080/api";

type Role = "STUDENT" | "ADMIN" | "COORDINATOR" | "RECRUITER";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("pat:token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const text = await response.text();
      let message = text;
      try {
        const json = JSON.parse(text);
        message = json.message || text;
      } catch {}
      throw new Error(message || "Something went wrong");
    }

    if (response.status === 204) return null;
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  },

  auth: {
    register: (data: any) =>
      api.request("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    login: (credentials: any) =>
      api.request("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    verifyOtp: (data: { email: string; code: string }) =>
      api.request("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    resendOtp: (data: { email: string }) =>
      api.request("/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  dashboard: {
    getStats: () => api.request("/dashboard/stats"),
  },
  drives: {
    getAll: () => api.request("/drives"),
    getById: (id: string) => api.request(`/drives/${id}`),
    create: (data: any) =>
      api.request("/drives", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  students: {
    getAll: () => api.request("/students"),
    getById: (id: string) => api.request(`/students/${id}`),
    getUnverified: () => api.request("/students/unverified"),
    update: (id: string, data: any) =>
      api.request(`/students/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    verify: (id: string) =>
      api.request(`/students/${id}/verify`, {
        method: "PATCH",
      }),
    uploadResume: (id: string, file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.request(`/students/${id}/resume`, {
        method: "POST",
        body: formData,
        // Let the browser set the content type for multipart/form-data
        headers: { "Content-Type": "AUTO" }, 
      });
    }
  },
  interviews: {
    getByStudent: (studentId: string) => api.request(`/interviews/student/${studentId}`),
  },
  applications: {
    apply: (data: { studentId: string; driveId: string }) =>
      api.request("/applications/apply", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getByStudent: (studentId: string) =>
      api.request(`/applications/student/${studentId}`),
    getPipeline: () => api.request("/applications/pipeline"),
    updateStatus: (id: string, status: string) =>
      api.request(`/applications/${id}/status?status=${status}`, {
        method: "PATCH",
      }),
  },
};
