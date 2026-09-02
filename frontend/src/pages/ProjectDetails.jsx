import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { projectService } from '../services/projectService'
import { taskService } from '../services/taskService'
import TaskFormModal from '../components/TaskFormModal'
import TaskCard from '../components/TaskCard'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import './Tasks.css'

export default function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const load = () => {
    projectService
      .get(id)
      .then(setProject)
      .catch(() => setError('This project could not be found.'))
    projectService.listTasks(id).then(setTasks).catch(() => {})
  }

  useEffect(load, [id])

  const handleCreate = async (values) => {
    await taskService.create({ ...values, project_id: Number(id) })
    load()
  }

  const handleUpdate = async (values) => {
    await taskService.update(editingTask.id, values)
    setEditingTask(null)
    load()
  }

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return
    await taskService.remove(task.id)
    load()
  }

  const handleDeleteProject = async () => {
    if (!window.confirm(`Delete "${project.name}"? This also removes its tasks.`)) return
    await projectService.remove(id)
    navigate('/projects')
  }

  if (error) return <div className="tf-error">{error}</div>
  if (!project) return null

  return (
    <div>
      <Link to="/projects" style={{ fontSize: 13, color: 'var(--tf-slate)' }}>
        ← All projects
      </Link>
      <div className="tf-page-header" style={{ marginTop: 10 }}>
        <div>
          <h1 className="tf-page-title">{project.name}</h1>
          {project.description && <p className="tf-page-subtitle">{project.description}</p>}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="danger" onClick={handleDeleteProject}>
            Delete project
          </Button>
          <Button onClick={() => setShowForm(true)}>+ New task</Button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks in this project yet"
          description="Add your first task to start tracking progress."
          action={<Button onClick={() => setShowForm(true)}>+ New task</Button>}
        />
      ) : (
        <div className="kanban-column-body">
          {tasks.map((task) => (
            <div key={task.id} onDoubleClick={() => setEditingTask(task)} style={{ maxWidth: 480 }}>
              <TaskCard task={task} onEdit={setEditingTask} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <TaskFormModal defaultProjectId={Number(id)} onClose={() => setShowForm(false)} onSubmit={handleCreate} />
      )}
      {editingTask && (
        <TaskFormModal initialValues={editingTask} onClose={() => setEditingTask(null)} onSubmit={handleUpdate} />
      )}
    </div>
  )
}
