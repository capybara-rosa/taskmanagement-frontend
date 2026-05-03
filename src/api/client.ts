import axios from 'axios'
import type {
  Task,
  TaskRequest,
  PagedResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', data)
    return res.data
  },
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', data)
    return res.data
  },
}

export const tasksApi = {
  getAll: async (page = 0, size = 10): Promise<PagedResponse<Task>> => {
    const res = await api.get<PagedResponse<Task>>('/tasks', {
      params: { page, size },
    })
    return res.data
  },
  getById: async (id: number): Promise<Task> => {
    const res = await api.get<Task>(`/tasks/${id}`)
    return res.data
  },
  create: async (data: TaskRequest): Promise<Task> => {
    const res = await api.post<Task>('/tasks', data)
    return res.data
  },
  update: async (id: number, data: TaskRequest): Promise<Task> => {
    const res = await api.put<Task>(`/tasks/${id}`, data)
    return res.data
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`)
  },
}
