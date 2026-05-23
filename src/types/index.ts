export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
  id: number
  title: string
  description?: string
  status: TaskStatus
  dueAt: string
  createdById: number
  createdByTS: string
  updatedById?: number
  updatedByTS?: string
  versionId: number
  priority: Priority
}

export interface TaskRequest {
  title: string
  description?: string
  status: TaskStatus
  dueAt: string
  priority: Priority
}

export interface PagedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface AuthResponse {
  token: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
}
