import { useEffect, useRef } from 'react'

type EmptyStateProps = {
  description?: string
  recoverFocus?: boolean
  title: string
}

function EmptyState({
  description,
  recoverFocus = false,
  title,
}: EmptyStateProps) {
  const elementRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const isFocusLost =
      !document.activeElement || document.activeElement === document.body
    if (recoverFocus && isFocusLost) {
      elementRef.current?.focus()
    }
  }, [recoverFocus])

  return (
    <div
      className="empty-state"
      ref={elementRef}
      tabIndex={recoverFocus ? -1 : undefined}
    >
      <strong>{title}</strong>
      {description ? <span>{description}</span> : null}
    </div>
  )
}

export default EmptyState
