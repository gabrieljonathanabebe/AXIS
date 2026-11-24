import type { ComponentProps, ReactNode } from 'react'

// ===== TYPES =================================================================
type ButtonContent =
  | {
      children: ReactNode
      'aria-label'?: string
    }
  | {
      children?: never
      'aria-label': string
    }

/** Shape and look of a button, e.g. a pill with text or a tile. */
export type ButtonKind = 'chip' | 'icon' | 'swatch' | 'text' | 'tile'

export type ButtonSize = 'xs' | 'sm' | 'md'

/** Weight of its surface: `ghost` shows none. */
export type ButtonVariant = 'accent' | 'ghost' | 'secondary'

/** What every kind of button offers beyond the native button. */
export type ButtonOptions = {
  isActive?: boolean
  kind?: ButtonKind
  pressed?: boolean
  size?: ButtonSize
  variant?: ButtonVariant
}

type ButtonProps = ButtonContent &
  Omit<ComponentProps<'button'>, 'children' | 'aria-label'> &
  ButtonOptions

// ===== CONSTANTS =============================================================
/** Classes of each kind; a size extends the first one. */
const KIND_CLASSES = {
  chip: 'chip',
  icon: 'icon-button',
  swatch: 'button swatch-button',
  text: 'button',
  tile: 'tile is-interactive',
} satisfies Record<ButtonKind, string>

// ===== COMPONENT =============================================================
/**
 * Base of every button: `kind` sets its shape, `size` and `variant` fit it
 * to its place. `pressed` marks a toggle that stays down, e.g. an active
 * command; `isActive` marks a chosen option that is no toggle, e.g. in a
 * menu.
 * @param props Content, kind, size, variant, state and native props.
 */
function Button({
  className = '',
  isActive = false,
  kind = 'text',
  pressed,
  size,
  type = 'button',
  variant = 'secondary',
  ...buttonProps
}: ButtonProps) {
  const kindClasses = KIND_CLASSES[kind]
  const [baseClass] = kindClasses.split(' ')
  return (
    <button
      className={[
        kindClasses,
        size ? `${baseClass}-${size}` : '',
        variant === 'secondary' ? '' : `button-${variant}`,
        isActive || pressed ? 'is-active' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      type={type}
      aria-pressed={pressed}
      {...buttonProps}
    />
  )
}

export default Button
