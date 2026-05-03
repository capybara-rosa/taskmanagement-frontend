import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tasksApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { TaskList } from '../components/TaskList'
import { TaskForm } from '../components/TaskForm'
import type { Task, TaskRequest } from '../types'

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const loadTasks = async () => {
    try {
      const data = await tasksApi.getAll(page, 9)
      setTasks(data.content)
      setTotalPages(data.totalPages)
    } catch {
      // Token expired or invalid
      logout()
      navigate('/login')
    }
  }

  useEffect(() => {
    loadTasks()
  }, [page])

  const handleCreate = async (data: TaskRequest) => {
    await tasksApi.create(data)
    setShowForm(false)
    loadTasks()
  }

  const handleUpdate = async (data: TaskRequest) => {
    if (editingTask) {
      await tasksApi.update(editingTask.id, data)
      setEditingTask(null)
      setShowForm(false)
      loadTasks()
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Delete this task?')) {
      await tasksApi.delete(id)
      loadTasks()
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

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {showForm ? (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdate : handleCreate}
            onCancel={handleCancel}
          />
        ) : (
          <>
            <div className="mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                + New Task
              </button>
            </div>

            <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="rounded border px-3 py-1 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="rounded border px-3 py-1 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
