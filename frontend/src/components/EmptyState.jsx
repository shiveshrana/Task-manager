export default function EmptyState({ title, description, action }) {
  return (
    <div className="tf-empty">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  )
}
