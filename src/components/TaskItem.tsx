import type { Task } from '../types'

interface Props {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
}

const statusColors = {
  TODO: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  DONE: 'bg-green-100 text-green-800',
}

export function TaskItem({ task, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <span className={`rounded px-2 py-1 text-sm ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>

      {task.description && <p className="mb-2 text-gray-600">{task.description}</p>}

      <p className="mb-3 text-sm text-gray-500">Due: {new Date(task.dueAt).toLocaleDateString()}</p>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
