export default function Modal({ title, onClose, children }) {
  return (
    <div className="tf-modal-backdrop" onClick={onClose}>
      <div className="tf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tf-modal-header">
          <h3>{title}</h3>
          <button className="tf-modal-close" onClick={onClose} type="button" aria-label="Close">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
