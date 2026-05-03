import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { TasksPage } from './TasksPage'
import { AuthProvider } from '../context/AuthContext'
import * as client from '../api/client'
import type { PagedResponse, Task } from '../types'

vi.mock('../api/client')

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'First task for testing',
    status: 'TODO',
    dueAt: '2026-07-01T00:00:00.000Z',
    createdById: 1,
    createdByTS: '2026-01-01T00:00:00.000Z',
    versionId: 1,
  },
  {
    id: 2,
    title: 'Second task in progress',
    status: 'IN_PROGRESS',
    dueAt: '2026-07-15T00:00:00.000Z',
    createdById: 1,
    createdByTS: '2026-01-01T00:00:00.000Z',
    versionId: 1,
  },
]

const pagedResponse: PagedResponse<Task> = {
  content: mockTasks,
  totalElements: 2,
  totalPages: 1,
  number: 0,
  size: 100,
  first: true,
  last: true,
  empty: false,
}

function renderPage() {
  localStorage.setItem('token', 'test-token')
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/tasks']}>
        <Routes>
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('TasksPage', () => {
  beforeEach(() => {
    vi.mocked(client.tasksApi.getAll).mockResolvedValue(pagedResponse)
    vi.mocked(client.tasksApi.create).mockResolvedValue(mockTasks[0])
    vi.mocked(client.tasksApi.update).mockResolvedValue(mockTasks[0])
    vi.mocked(client.tasksApi.delete).mockResolvedValue(undefined)
  })

  it('renders the board header', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Task Manager')).toBeInTheDocument())
  })

  it('loads and displays tasks in their columns', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('First task for testing')).toBeInTheDocument()
      expect(screen.getByText('Second task in progress')).toBeInTheDocument()
    })
  })

  it('shows all three kanban column labels', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('To Do')).toBeInTheDocument()
      expect(screen.getByText('In Progress')).toBeInTheDocument()
      expect(screen.getByText('Done')).toBeInTheDocument()
    })
  })

  it('shows the task form when New Task is clicked', async () => {
    renderPage()
    await waitFor(() => screen.getByText('+ New Task'))
    fireEvent.click(screen.getByText('+ New Task'))
    expect(screen.getByText('New Task')).toBeInTheDocument()
  })

  it('shows an error toast when create fails', async () => {
    vi.mocked(client.tasksApi.create).mockRejectedValue(new Error('network error'))
    renderPage()
    await waitFor(() => screen.getByText('+ New Task'))

    fireEvent.click(screen.getByText('+ New Task'))
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'A valid task title for testing' },
    })
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2026-12-01T10:00' } })
    fireEvent.submit(screen.getByRole('button', { name: /create/i }).closest('form')!)

    await waitFor(() => expect(screen.getByText(/failed to create task/i)).toBeInTheDocument())
  })

  it('shows an error toast when delete fails', async () => {
    vi.mocked(client.tasksApi.delete).mockRejectedValue(new Error('network error'))
    renderPage()
    await waitFor(() => screen.getByText('First task for testing'))

    fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[0])

    await waitFor(() => expect(screen.getByText(/failed to delete task/i)).toBeInTheDocument())
  })

  it('shows an error toast when load fails', async () => {
    vi.mocked(client.tasksApi.getAll).mockRejectedValue(new Error('network error'))
    renderPage()
    await waitFor(() => expect(screen.getByText(/failed to load tasks/i)).toBeInTheDocument())
  })
})
