const PRIORITY_STYLES = {
  LOW: { label: 'Low', color: 'var(--tf-slate)' },
  MEDIUM: { label: 'Medium', color: 'var(--tf-indigo)' },
  HIGH: { label: 'High', color: 'var(--tf-coral)' },
}

export default function PriorityTag({ priority }) {
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.MEDIUM
  return (
    <span
      style={{
        fontFamily: 'var(--tf-font-mono)',
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        color: style.color,
      }}
    >
      {style.label}
    </span>
  )
}
