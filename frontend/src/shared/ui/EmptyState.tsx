import { useEffect, useRef } from 'react'

import type { ReactNode } from 'react'

type EmptyStateIconVariant = 'badge' | 'illustration'

type EmptyStateSize = 'md' | 'sm'

type EmptyStateTone = 'neutral' | 'danger'

export type EmptyStateProps = {
  description?: string
  icon?: ReactNode
  iconVariant?: EmptyStateIconVariant
  recoverFocus?: boolean
  size?: EmptyStateSize
  title: string
  tone?: EmptyStateTone
}

function EmptyState({
  description,
  icon,
  iconVariant = 'badge',
  recoverFocus = false,
  size = 'md',
  title,
  tone = 'neutral',
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
      className={`empty-state ${size === 'sm' ? 'is-sm' : ''} ${
        tone === 'danger' ? 'is-danger' : ''
      }`}
      ref={elementRef}
      role={tone === 'danger' ? 'alert' : undefined}
      tabIndex={recoverFocus ? -1 : undefined}
    >
      {icon ? (
        <span className={`empty-state-icon is-${iconVariant}`} aria-hidden>
          {icon}
        </span>
      ) : null}
      <strong>{title}</strong>
      {description ? (
        <span className="empty-state-description">{description}</span>
      ) : null}
    </div>
  )
}

export default EmptyState
