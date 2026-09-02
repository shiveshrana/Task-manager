import { useEffect, useMemo, useState } from 'react'
import { taskService } from '../services/taskService'
import { projectService } from '../services/projectService'
import TaskFormModal from '../components/TaskFormModal'
import TaskCard from '../components/TaskCard'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import './Tasks.css'

const COLUMNS = [
  { key: 'TODO', label: 'To do' },
  { key: 'IN_PROGRESS', label: 'In progress' },
  { key: 'REVIEW', label: 'In review' },
  { key: 'COMPLETED', label: 'Completed' },
]

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [projectFilter, setProjectFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [dragTaskId, setDragTaskId] = useState(null)

  const loadTasks = () => {
    setLoading(true)
    taskService
      .list({ projectId: projectFilter || undefined })
      .then(setTasks)
      .catch(() => setError('Could not load tasks.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    projectService.list().then(setProjects).catch(() => {})
  }, [])

  useEffect(loadTasks, [projectFilter])

  const columns = useMemo(() => {
    const grouped = Object.fromEntries(COLUMNS.map((c) => [c.key, []]))
    tasks.forEach((t) => grouped[t.status]?.push(t))
    return grouped
  }, [tasks])

  const handleCreate = async (values) => {
    await taskService.create(values)
    loadTasks()
  }

  const handleUpdate = async (values) => {
    await taskService.update(editingTask.id, values)
    setEditingTask(null)
    loadTasks()
  }

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return
    await taskService.remove(task.id)
    loadTasks()
  }

  const handleDrop = async (status) => {
    if (!dragTaskId) return
    const task = tasks.find((t) => t.id === dragTaskId)
    setDragTaskId(null)
    if (!task || task.status === status) return
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status } : t)))
    try {
      await taskService.update(task.id, { status })
    } catch {
      loadTasks()
    }
  }

  return (
    <div>
      <div className="tf-page-header">
        <div>
          <h1 className="tf-page-title">Tasks</h1>
          <p className="tf-page-subtitle">Drag a card to move it through your workflow.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select
            className="tf-select"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <Button onClick={() => setShowForm(true)}>+ New task</Button>
        </div>
      </div>

      {error && <div className="tf-error">{error}</div>}

      {!loading && tasks.length === 0 && !error && (
        <EmptyState
          title="No tasks here yet"
          description="Create a task to get your board moving."
          action={<Button onClick={() => setShowForm(true)}>+ New task</Button>}
        />
      )}

      {tasks.length > 0 && (
        <div className="kanban-board">
          {COLUMNS.map((col) => (
            <div
              className="kanban-column"
              key={col.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(col.key)}
            >
              <div className="kanban-column-header">
                <span className={`status-rail rail-${col.key.toLowerCase()}`} style={{ height: 14 }} />
                <span>{col.label}</span>
                <span className="kanban-count">{columns[col.key].length}</span>
              </div>
              <div className="kanban-column-body">
                {columns[col.key].map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => setDragTaskId(task.id)}
                    onDoubleClick={() => setEditingTask(task)}
                  >
                    <TaskCard task={task} onEdit={setEditingTask} onDelete={handleDelete} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <TaskFormModal
          defaultProjectId={projectFilter || undefined}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
        />
      )}
      {editingTask && (
        <TaskFormModal initialValues={editingTask} onClose={() => setEditingTask(null)} onSubmit={handleUpdate} />
      )}
    </div>
  )
}
