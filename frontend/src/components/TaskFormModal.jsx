import { useEffect, useState } from 'react'
import Modal from './Modal'
import Button from './Button'
import { projectService } from '../services/projectService'
import { userService } from '../services/userService'

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH']

export default function TaskFormModal({ initialValues, defaultProjectId, onClose, onSubmit }) {
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    status: initialValues?.status || 'TODO',
    priority: initialValues?.priority || 'MEDIUM',
    project_id: initialValues?.project_id || defaultProjectId || '',
    assignee_id: initialValues?.assignee?.id || '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const isEdit = Boolean(initialValues)

  useEffect(() => {
    projectService.list().then(setProjects).catch(() => {})
    userService.list().then(setUsers).catch(() => {})
  }, [])

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await onSubmit({
        ...form,
        project_id: Number(form.project_id),
        assignee_id: form.assignee_id ? Number(form.assignee_id) : null,
      })
      onClose()
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not save this task.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={isEdit ? 'Edit task' : 'New task'} onClose={onClose}>
      {error && <div className="tf-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="tf-field">
          <label htmlFor="task-title">Title</label>
          <input
            id="task-title"
            className="tf-input"
            value={form.title}
            onChange={update('title')}
            required
            autoFocus
          />
        </div>
        <div className="tf-field">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            className="tf-textarea"
            value={form.description}
            onChange={update('description')}
          />
        </div>
        <div className="tf-field">
          <label htmlFor="task-project">Project</label>
          <select
            id="task-project"
            className="tf-select"
            value={form.project_id}
            onChange={update('project_id')}
            required
          >
            <option value="" disabled>
              Select a project
            </option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="tf-field">
            <label htmlFor="task-status">Status</label>
            <select id="task-status" className="tf-select" value={form.status} onChange={update('status')}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="tf-field">
            <label htmlFor="task-priority">Priority</label>
            <select id="task-priority" className="tf-select" value={form.priority} onChange={update('priority')}>
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="tf-field">
          <label htmlFor="task-assignee">Assignee</label>
          <select id="task-assignee" className="tf-select" value={form.assignee_id} onChange={update('assignee_id')}>
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.full_name || u.username}
              </option>
            ))}
          </select>
        </div>
        <div className="tf-modal-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create task'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
