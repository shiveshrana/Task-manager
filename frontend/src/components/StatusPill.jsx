const STATUS_LABELS = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  REVIEW: 'In review',
  COMPLETED: 'Completed',
}

const STATUS_VARS = {
  TODO: '--tf-status-todo',
  IN_PROGRESS: '--tf-status-progress',
  REVIEW: '--tf-status-review',
  COMPLETED: '--tf-status-completed',
}

export default function StatusPill({ status }) {
  const colorVar = STATUS_VARS[status] || '--tf-slate'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        fontWeight: 600,
        padding: '3px 10px',
        borderRadius: 999,
        color: `var(${colorVar})`,
        background: `color-mix(in srgb, var(${colorVar}) 14%, white)`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: `var(${colorVar})`,
        }}
      />
      {STATUS_LABELS[status] || status}
    </span>
  )
}
