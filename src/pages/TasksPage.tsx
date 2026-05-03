import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { tasksApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { TaskList } from '../components/TaskList'
import { TaskForm } from '../components/TaskForm'
import type { Task, TaskRequest, TaskStatus } from '../types'

const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']

function sortByDueDateAsc(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
}

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { logout } = useAuth()
  const navigate = useNavigate()

  // Auto-dismiss error toast after 4 s
  useEffect(() => {
    if (!errorMessage) return
    const timer = setTimeout(() => setErrorMessage(null), 4000)
    return () => clearTimeout(timer)
  }, [errorMessage])

  const loadTasks = useCallback(async () => {
    try {
      const data = await tasksApi.getAll(0, 100)
      setTasks(data.content)
    } catch {
      logout()
      navigate('/login')
    }
  }, [logout, navigate])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTasks()
  }, [loadTasks])

  const columnTasks = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = { TODO: [], IN_PROGRESS: [], DONE: [] }
    for (const task of tasks) {
      groups[task.status].push(task)
    }
    return {
      TODO: sortByDueDateAsc(groups.TODO),
      IN_PROGRESS: sortByDueDateAsc(groups.IN_PROGRESS),
      DONE: sortByDueDateAsc(groups.DONE),
    }
  }, [tasks])

  const handleCreate = async (data: TaskRequest) => {
    try {
      await tasksApi.create(data)
      setShowForm(false)
      loadTasks()
    } catch {
      setErrorMessage('Failed to create task. Please try again.')
    }
  }

  const handleUpdate = async (data: TaskRequest) => {
    if (!editingTask) return
    try {
      await tasksApi.update(editingTask.id, data)
      setEditingTask(null)
      setShowForm(false)
      loadTasks()
    } catch {
      setErrorMessage('Failed to update task. Please try again.')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this task?')) return
    try {
      await tasksApi.delete(id)
      loadTasks()
    } catch {
      setErrorMessage('Failed to delete task. Please try again.')
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleCancel = () => {
    setEditingTask(null)
    setShowForm(false)
  }

  const handleDrop = async (taskId: number, newStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.status === newStatus) return
    try {
      await tasksApi.update(taskId, {
        title: task.title,
        description: task.description,
        status: newStatus,
        dueAt: task.dueAt,
      })
      loadTasks()
    } catch {
      setErrorMessage('Failed to move task. Please try again.')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="header px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-lg font-semibold text-neutral-900">Task Manager</h1>
          <div className="flex items-center gap-3">
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="new-task-style">
                + New Task
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {showForm ? (
          <div className="mx-auto max-w-lg">
            <TaskForm
              key={editingTask?.id ?? 'new'}
              task={editingTask}
              onSubmit={editingTask ? handleUpdate : handleCreate}
              onCancel={handleCancel}
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {STATUSES.map((status) => (
              <TaskList
                key={status}
                status={status}
                tasks={columnTasks[status]}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDrop={handleDrop}
              />
            ))}
          </div>
        )}
      </main>

      {/* Error toast */}
      {errorMessage && (
        <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-lg border border-red-200 bg-white px-4 py-3 shadow-lg">
          <span className="h-2 w-2 shrink-0 rounded-full bg-red-400" />
          <span className="text-sm text-neutral-700">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="ml-1 text-lg leading-none text-neutral-400 hover:text-neutral-600"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
