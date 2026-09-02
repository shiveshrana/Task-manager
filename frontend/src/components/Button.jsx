export default function Button({ variant = 'primary', as: Component = 'button', children, ...props }) {
  return (
    <Component className={`tf-btn tf-btn-${variant}`} {...props}>
      {children}
    </Component>
  )
}
