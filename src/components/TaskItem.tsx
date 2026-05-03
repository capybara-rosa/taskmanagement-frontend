import { useState } from 'react'
import type { Task } from '../types'

interface Props {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
}

const statusColors = {
  TODO: 'bg-neutral-100 text-neutral-600',
  IN_PROGRESS: 'bg-blue-50 text-blue-700',
  DONE: 'bg-green-50 text-green-700',
}

const statusLabels = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
}

export function TaskItem({ task, onEdit, onDelete }: Props) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div
      draggable
      onDoubleClick={() => onEdit(task)}
      onDragStart={(e) => {
        e.dataTransfer.setData('taskId', task.id.toString())
        e.dataTransfer.effectAllowed = 'move'
        setIsDragging(true)
      }}
      onDragEnd={() => setIsDragging(false)}
      className={`cursor-grab rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-opacity duration-150 active:cursor-grabbing ${
        isDragging ? 'opacity-40' : 'opacity-100'
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-sm leading-snug font-semibold text-neutral-900">{task.title}</h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[task.status]}`}
        >
          {statusLabels[task.status]}
        </span>
      </div>

      {task.description && (
        <p className="mb-3 text-xs leading-relaxed text-neutral-500">{task.description}</p>
      )}

      <p className="mb-3 text-xs text-neutral-400">
        Due{' '}
        {new Date(task.dueAt).toLocaleDateString('en-UK', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>

      <div className="flex gap-2">
        <button onClick={() => onEdit(task)} className="edit-button-style">
          Edit
        </button>
        <button onClick={() => onDelete(task.id)} className="delete-button-style">
          Delete
        </button>
      </div>
    </div>
  )
}
