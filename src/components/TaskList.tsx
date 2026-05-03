import type { Task } from '../types'
import { TaskItem } from './TaskItem'

interface Props {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
}

export function TaskList({ tasks, onEdit, onDelete }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">No tasks yet. Create one to get started!</div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
