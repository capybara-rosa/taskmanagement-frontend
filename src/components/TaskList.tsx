import { useState } from 'react'
import type { Task, TaskStatus } from '../types'
import { TaskItem } from './TaskItem'

const COLUMN_CONFIG: Record<TaskStatus, { label: string; dot: string; countClass: string }> = {
  TODO: {
    label: 'To Do',
    dot: 'bg-neutral-400',
    countClass: 'bg-neutral-100 text-neutral-500',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    dot: 'bg-blue-400',
    countClass: 'bg-blue-50 text-blue-600',
  },
  DONE: {
    label: 'Done',
    dot: 'bg-green-400',
    countClass: 'bg-green-50 text-green-600',
  },
}

interface Props {
  status: TaskStatus
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
  onDrop: (taskId: number, newStatus: TaskStatus) => void
}

export function TaskList({ status, tasks, onEdit, onDelete, onDrop }: Props) {
  const [isDragOver, setIsDragOver] = useState(false)
  const config = COLUMN_CONFIG[status]

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    const related = e.relatedTarget as Node | null
    if (!related || !e.currentTarget.contains(related)) {
      setIsDragOver(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const taskId = parseInt(e.dataTransfer.getData('taskId'))
    if (!isNaN(taskId)) onDrop(taskId, status)
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex min-h-96 flex-col rounded-xl border p-3 transition-all duration-150 ${
        isDragOver
          ? 'border-neutral-400 bg-neutral-100 shadow-inner'
          : 'border-neutral-200 bg-neutral-50'
      }`}
    >
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className={`h-2 w-2 shrink-0 rounded-full ${config.dot}`} />
        <span className="text-sm font-semibold text-neutral-700">{config.label}</span>
        <span
          className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${config.countClass}`}
        >
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
        ))}
        <div
          className={`flex flex-1 items-center justify-center rounded-lg border-2 border-dashed py-6 text-xs transition-colors duration-150 ${
            isDragOver
              ? 'border-neutral-400 text-neutral-500'
              : 'border-neutral-200 text-neutral-400'
          } ${tasks.length > 0 ? 'min-h-14' : ''}`}
        >
          {isDragOver ? 'Release to move here' : 'Drop tasks here'}
        </div>
      </div>
    </div>
  )
}
