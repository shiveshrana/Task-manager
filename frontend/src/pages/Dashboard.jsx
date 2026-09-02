import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dashboardService } from '../services/userService'
import StatusPill from '../components/StatusPill'
import PriorityTag from '../components/PriorityTag'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import './Dashboard.css'

const STAT_CONFIG = [
  { key: 'total_projects', label: 'Projects' },
  { key: 'total_tasks', label: 'Total tasks' },
  { key: 'in_progress_tasks', label: 'In progress' },
  { key: 'pending_tasks', label: 'Pending' },
  { key: 'completed_tasks', label: 'Completed' },
]

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    dashboardService
      .getStats()
      .then(setStats)
      .catch(() => setError('Could not load your dashboard right now.'))
  }, [])

  return (
    <div>
      <div className="tf-page-header">
        <div>
          <h1 className="tf-page-title">Dashboard</h1>
          <p className="tf-page-subtitle">A snapshot of where your team's work stands.</p>
        </div>
        <Button as={Link} to="/tasks">
          View all tasks
        </Button>
      </div>

      {error && <div className="tf-error">{error}</div>}

      {stats && (
        <>
          <div className="stat-rail">
            {STAT_CONFIG.map(({ key, label }) => (
              <div className="stat-tile tf-card" key={key}>
                <span className="stat-label">{label}</span>
                <span className="stat-number">{stats[key]}</span>
              </div>
            ))}
          </div>

          <div className="tf-card recent-tasks">
            <div className="recent-tasks-header">
              <h2 style={{ fontSize: 16 }}>Recent tasks</h2>
            </div>
            {stats.recent_tasks.length === 0 ? (
              <EmptyState
                title="No tasks yet"
                description="Create a project and add your first task to see it here."
                action={
                  <Button as={Link} to="/projects">
                    Go to projects
                  </Button>
                }
              />
            ) : (
              <ul className="recent-task-list">
                {stats.recent_tasks.map((task) => (
                  <li key={task.id} className="recent-task-row">
                    <span className={`status-rail rail-${task.status.toLowerCase()}`} />
                    <div className="recent-task-main">
                      <span className="recent-task-title">{task.title}</span>
                      {task.assignee && (
                        <span className="recent-task-assignee">
                          Assigned to {task.assignee.full_name || task.assignee.username}
                        </span>
                      )}
                    </div>
                    <PriorityTag priority={task.priority} />
                    <StatusPill status={task.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}
