import PriorityTag from './PriorityTag'

export default function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className={`task-card rail-${task.status.toLowerCase()}`}>
      <div className="task-card-top">
        <span className="task-card-title">{task.title}</span>
        <div className="task-card-menu">
          <button className="tf-modal-close" style={{ fontSize: 13 }} onClick={() => onEdit(task)} title="Edit">
            ✎
          </button>
          <button
            className="tf-modal-close"
            style={{ fontSize: 13, color: 'var(--tf-coral)' }}
            onClick={() => onDelete(task)}
            title="Delete"
          >
            🗑
          </button>
        </div>
      </div>
      {task.description && <p className="task-card-desc">{task.description}</p>}
      <div className="task-card-footer">
        <PriorityTag priority={task.priority} />
        {task.assignee && (
          <span className="task-card-assignee" title={task.assignee.full_name || task.assignee.username}>
            {(task.assignee.full_name || task.assignee.username)[0].toUpperCase()}
          </span>
        )}
      </div>
    </div>
  )
}
