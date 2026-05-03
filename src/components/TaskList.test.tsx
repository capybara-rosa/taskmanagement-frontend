import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskList } from './TaskList'
import type { Task } from '../types'

const makeTasks = (count: number): Task[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Task number ${i + 1} title`,
    status: 'TODO' as const,
    dueAt: `2026-0${i + 1}-01T00:00:00.000Z`,
    createdById: 1,
    createdByTS: '2026-01-01T00:00:00.000Z',
    versionId: 1,
  }))

describe('TaskList', () => {
  it('renders the column label and task count', () => {
    render(
      <TaskList
        status="TODO"
        tasks={makeTasks(3)}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onDrop={vi.fn()}
      />
    )
    // TaskItem also renders a "To Do" badge per task, so multiple matches are expected
    expect(screen.getAllByText('To Do').length).toBeGreaterThan(0)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders a card for each task', () => {
    render(
      <TaskList
        status="IN_PROGRESS"
        tasks={makeTasks(2)}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onDrop={vi.fn()}
      />
    )
    expect(screen.getByText('Task number 1 title')).toBeInTheDocument()
    expect(screen.getByText('Task number 2 title')).toBeInTheDocument()
  })

  it('shows drop zone text when there are no tasks', () => {
    render(
      <TaskList status="DONE" tasks={[]} onEdit={vi.fn()} onDelete={vi.fn()} onDrop={vi.fn()} />
    )
    expect(screen.getByText('Drop tasks here')).toBeInTheDocument()
  })

  it('calls onDrop with taskId and column status on drop', () => {
    const onDrop = vi.fn()
    render(
      <TaskList status="DONE" tasks={[]} onEdit={vi.fn()} onDelete={vi.fn()} onDrop={onDrop} />
    )
    const column = screen.getByText('Done').closest('div[class*="rounded-xl"]')!
    fireEvent.dragOver(column)
    fireEvent.drop(column, { dataTransfer: { getData: () => '42' } })
    expect(onDrop).toHaveBeenCalledWith(42, 'DONE')
  })

  it('updates drop zone text to "Release to move here" while dragging over', () => {
    render(
      <TaskList status="TODO" tasks={[]} onEdit={vi.fn()} onDelete={vi.fn()} onDrop={vi.fn()} />
    )
    const column = screen.getByText('To Do').closest('div[class*="rounded-xl"]')!
    fireEvent.dragOver(column)
    expect(screen.getByText('Release to move here')).toBeInTheDocument()
  })

  it('renders correct labels for all three statuses', () => {
    const statuses = [
      { status: 'TODO' as const, label: 'To Do' },
      { status: 'IN_PROGRESS' as const, label: 'In Progress' },
      { status: 'DONE' as const, label: 'Done' },
    ]
    statuses.forEach(({ status, label }) => {
      const { unmount } = render(
        <TaskList status={status} tasks={[]} onEdit={vi.fn()} onDelete={vi.fn()} onDrop={vi.fn()} />
      )
      expect(screen.getByText(label)).toBeInTheDocument()
      unmount()
    })
  })
})
