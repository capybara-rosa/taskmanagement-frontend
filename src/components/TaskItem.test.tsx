import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskItem } from './TaskItem'
import type { Task } from '../types'

const baseTask: Task = {
  id: 1,
  title: 'Fix the login bug now',
  description: 'Users cannot log in with valid credentials',
  status: 'TODO',
  dueAt: '2026-06-01T12:00:00.000Z',
  createdById: 1,
  createdByTS: '2026-01-01T00:00:00.000Z',
  versionId: 1,
}

describe('TaskItem', () => {
  it('renders title and formatted due date', () => {
    render(<TaskItem task={baseTask} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Fix the login bug now')).toBeInTheDocument()
    expect(screen.getByText(/1 Jun 2026/)).toBeInTheDocument()
  })

  it('renders description when present', () => {
    render(<TaskItem task={baseTask} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Users cannot log in with valid credentials')).toBeInTheDocument()
  })

  it('does not render description when absent', () => {
    const task = { ...baseTask, description: undefined }
    render(<TaskItem task={task} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByText('Users cannot log in with valid credentials')).not.toBeInTheDocument()
  })

  it('calls onEdit with task when Edit button is clicked', () => {
    const onEdit = vi.fn()
    render(<TaskItem task={baseTask} onEdit={onEdit} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(onEdit).toHaveBeenCalledOnce()
    expect(onEdit).toHaveBeenCalledWith(baseTask)
  })

  it('calls onDelete with task id when Delete button is clicked', () => {
    const onDelete = vi.fn()
    render(<TaskItem task={baseTask} onEdit={vi.fn()} onDelete={onDelete} />)
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).toHaveBeenCalledOnce()
    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('calls onEdit on double-click of the card', () => {
    const onEdit = vi.fn()
    render(<TaskItem task={baseTask} onEdit={onEdit} onDelete={vi.fn()} />)
    const card = screen.getByText('Fix the login bug now').closest('[draggable]')!
    fireEvent.doubleClick(card)
    expect(onEdit).toHaveBeenCalledWith(baseTask)
  })

  it('sets taskId in dataTransfer on drag start', () => {
    render(<TaskItem task={baseTask} onEdit={vi.fn()} onDelete={vi.fn()} />)
    const card = screen.getByText('Fix the login bug now').closest('[draggable]')!
    const dataTransfer = { setData: vi.fn(), effectAllowed: '' }
    fireEvent.dragStart(card, { dataTransfer })
    expect(dataTransfer.setData).toHaveBeenCalledWith('taskId', '1')
  })

  it('displays the correct status badge for each status', () => {
    const statuses: Array<Task['status']> = ['TODO', 'IN_PROGRESS', 'DONE']
    const labels = ['To Do', 'In Progress', 'Done']
    statuses.forEach((status, i) => {
      const { unmount } = render(
        <TaskItem task={{ ...baseTask, status }} onEdit={vi.fn()} onDelete={vi.fn()} />
      )
      expect(screen.getByText(labels[i])).toBeInTheDocument()
      unmount()
    })
  })
})
