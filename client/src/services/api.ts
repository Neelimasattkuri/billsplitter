import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),

  register: (name: string, email: string, password: string) => api.post("/auth/register", { name, email, password }),

  getCurrentUser: () => api.get("/auth/me"),

  updateProfile: (data: { name?: string; email?: string }) => api.put("/auth/profile", data),
}

// Users API
export const usersAPI = {
  getAll: () => api.get("/users"),

  getById: (id: string) => api.get(`/users/${id}`),

  search: (query: string) => api.get(`/users/search/${query}`),
}

// Bills API
export const billsAPI = {
  getAll: (params?: {
    page?: number
    limit?: number
    status?: string
    category?: string
    search?: string
  }) => api.get("/bills", { params }),

  getById: (id: string) => api.get(`/bills/${id}`),

  create: (data: {
    title: string
    amount: number
    description?: string
    date: string
    dueDate: string
    status?: string
    users: string[]
    category?: string
  }) => api.post("/bills", data),

  update: (id: string, data: any) => api.put(`/bills/${id}`, data),

  delete: (id: string) => api.delete(`/bills/${id}`),

  getStats: () => api.get("/bills/stats/summary"),
}

export default api
