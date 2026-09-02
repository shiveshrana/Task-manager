import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { projectService } from '../services/projectService'
import ProjectFormModal from '../components/ProjectFormModal'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import './Projects.css'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  const loadProjects = () => {
    setLoading(true)
    projectService
      .list()
      .then(setProjects)
      .catch(() => setError('Could not load your projects.'))
      .finally(() => setLoading(false))
  }

  useEffect(loadProjects, [])

  const handleCreate = async (values) => {
    await projectService.create(values)
    loadProjects()
  }

  const handleUpdate = async (values) => {
    await projectService.update(editingProject.id, values)
    setEditingProject(null)
    loadProjects()
  }

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.name}"? This also removes its tasks.`)) return
    await projectService.remove(project.id)
    loadProjects()
  }

  return (
    <div>
      <div className="tf-page-header">
        <div>
          <h1 className="tf-page-title">Projects</h1>
          <p className="tf-page-subtitle">Organize your team's work by initiative.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>+ New project</Button>
      </div>

      {error && <div className="tf-error">{error}</div>}

      {!loading && projects.length === 0 && !error && (
        <EmptyState
          title="No projects yet"
          description="Create your first project to start tracking tasks."
          action={<Button onClick={() => setShowForm(true)}>+ New project</Button>}
        />
      )}

      <div className="project-grid">
        {projects.map((project) => (
          <div className="tf-card project-card" key={project.id}>
            <Link to={`/projects/${project.id}`} className="project-card-title">
              {project.name}
            </Link>
            {project.description && <p className="project-card-desc">{project.description}</p>}
            <div className="project-card-footer">
              <span className="project-card-stat">
                {project.completed_task_count}/{project.task_count} tasks done
              </span>
              <div className="project-card-actions">
                <button className="tf-modal-close" style={{ fontSize: 14 }} onClick={() => setEditingProject(project)} title="Edit">
                  ✎
                </button>
                <button
                  className="tf-modal-close"
                  style={{ fontSize: 14, color: 'var(--tf-coral)' }}
                  onClick={() => handleDelete(project)}
                  title="Delete"
                >
                  🗑
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && <ProjectFormModal onClose={() => setShowForm(false)} onSubmit={handleCreate} />}
      {editingProject && (
        <ProjectFormModal
          initialValues={editingProject}
          onClose={() => setEditingProject(null)}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  )
}
