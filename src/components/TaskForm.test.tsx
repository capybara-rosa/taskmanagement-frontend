import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from './TaskForm'
import type { Task } from '../types'

const editTask: Task = {
  id: 5,
  title: 'Fix the payment flow',
  description: 'Stripe webhook is failing',
  status: 'IN_PROGRESS',
  dueAt: '2026-08-15T10:30:00.000Z',
  createdById: 1,
  createdByTS: '2026-01-01T00:00:00.000Z',
  versionId: 2,
}

describe('TaskForm — new task', () => {
  it('shows "New Task" heading', () => {
    render(<TaskForm onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('New Task')).toBeInTheDocument()
  })

  it('renders empty fields by default', () => {
    render(<TaskForm onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByDisplayValue('To Do')).toBeInTheDocument()
    // title input should be empty
    expect(screen.getByLabelText('Title')).toHaveValue('')
  })

  it('calls onCancel when Cancel is clicked', () => {
    const onCancel = vi.fn()
    render(<TaskForm onSubmit={vi.fn()} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('submits the form with entered values', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<TaskForm onSubmit={onSubmit} onCancel={vi.fn()} />)

    await user.type(screen.getByLabelText('Title'), 'My new task title here')
    await user.type(screen.getByLabelText('Description'), 'Some description')
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2026-12-01T10:00' } })

    fireEvent.submit(screen.getByRole('button', { name: /create/i }).closest('form')!)

    expect(onSubmit).toHaveBeenCalledOnce()
    const arg = onSubmit.mock.calls[0][0]
    expect(arg.title).toBe('My new task title here')
    expect(arg.status).toBe('TODO')
  })
})

describe('TaskForm — edit task', () => {
  it('shows "Edit Task" heading', () => {
    render(<TaskForm task={editTask} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('Edit Task')).toBeInTheDocument()
  })

  it('pre-fills title from the task prop', () => {
    render(<TaskForm task={editTask} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByDisplayValue('Fix the payment flow')).toBeInTheDocument()
  })

  it('pre-fills description from the task prop', () => {
    render(<TaskForm task={editTask} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByDisplayValue('Stripe webhook is failing')).toBeInTheDocument()
  })

  it('pre-fills status from the task prop', () => {
    render(<TaskForm task={editTask} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByDisplayValue('In Progress')).toBeInTheDocument()
  })

  it('shows Update button instead of Create', () => {
    render(<TaskForm task={editTask} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /create/i })).not.toBeInTheDocument()
  })

  it('calls onSubmit with updated values', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<TaskForm task={editTask} onSubmit={onSubmit} onCancel={vi.fn()} />)

    const titleInput = screen.getByDisplayValue('Fix the payment flow')
    await user.clear(titleInput)
    await user.type(titleInput, 'Updated title text here')

    fireEvent.submit(screen.getByRole('button', { name: /update/i }).closest('form')!)

    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit.mock.calls[0][0].title).toBe('Updated title text here')
    expect(onSubmit.mock.calls[0][0].status).toBe('IN_PROGRESS')
  })
})
