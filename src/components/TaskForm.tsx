import { useState } from 'react'
import type { Task, TaskRequest, TaskStatus } from '../types'

interface Props {
  task?: Task | null
  onSubmit: (data: TaskRequest) => void
  onCancel: () => void
}

export function TaskForm({ task, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'TODO')
  const [dueAt, setDueAt] = useState(task ? task.dueAt.slice(0, 16) : '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      description: description || undefined,
      status,
      dueAt: new Date(dueAt).toISOString(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold">{task ? 'Edit Task' : 'New Task'}</h2>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          minLength={10}
          maxLength={50}
          required
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={200}
          rows={3}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          className="w-full rounded border px-3 py-2"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Due Date</label>
        <input
          type="datetime-local"
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          required
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          {task ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
