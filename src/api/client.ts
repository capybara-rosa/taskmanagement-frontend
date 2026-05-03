import axios from 'axios'
import type {
  Task,
  TaskRequest,
  PagedResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../types'

if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn('[api] VITE_API_BASE_URL is not set — requests will hit the current origin')
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/',
  headers: { 'Content-Type': 'application/json' },
})

export function setTokenGetter(getter: () => string | null) {
  api.interceptors.request.use((config) => {
    const token = getter()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
}

export function onUnauthorized(handler: () => void) {
  api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (axios.isAxiosError(err) && err.response?.status === 401) handler()
      return Promise.reject(err)
    }
  )
}

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
  getAll: async (
    page: number,
    size: number,
    signal?: AbortSignal
  ): Promise<PagedResponse<Task>> => {
    const res = await api.get<PagedResponse<Task>>('/tasks', { params: { page, size }, signal })
    return res.data
  },
  getById: async (id: number, signal?: AbortSignal): Promise<Task> => {
    const res = await api.get<Task>(`/tasks/${id}`, { signal })
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
    await api.delete<void>(`/tasks/${id}`)
  },
}
