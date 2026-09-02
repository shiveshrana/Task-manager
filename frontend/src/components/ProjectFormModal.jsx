import { useState } from 'react'
import Modal from './Modal'
import Button from './Button'

export default function ProjectFormModal({ initialValues, onClose, onSubmit }) {
  const [name, setName] = useState(initialValues?.name || '')
  const [description, setDescription] = useState(initialValues?.description || '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const isEdit = Boolean(initialValues)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await onSubmit({ name, description })
      onClose()
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not save this project.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={isEdit ? 'Edit project' : 'New project'} onClose={onClose}>
      {error && <div className="tf-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="tf-field">
          <label htmlFor="project-name">Name</label>
          <input
            id="project-name"
            className="tf-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="tf-field">
          <label htmlFor="project-description">Description</label>
          <textarea
            id="project-description"
            className="tf-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this project for?"
          />
        </div>
        <div className="tf-modal-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create project'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
