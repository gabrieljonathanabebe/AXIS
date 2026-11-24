import Button from './Button'

import type { ComponentProps, CSSProperties, ReactNode } from 'react'

// ===== TYPES =================================================================
type SwatchButtonProps = {
  /** CSS color of the swatch, e.g. of a preset. */
  color?: string
  /** CSS background in place of the color, e.g. a gradient or glass. */
  fill?: string
  /** Icon in place of a color, e.g. the kind of an effect. */
  icon?: ReactNode
  label: string
} & Omit<ComponentProps<'button'>, 'aria-label' | 'children' | 'color'>

// ===== COMPONENT =============================================================
/**
 * Round swatch as a button: a color, a fill or an icon, e.g. the trigger
 * of a color picker or a preset inside it. A `ref` reaches the button, e.g.
 * as the trigger of a popover.
 * @param props Color, fill or icon, name and native props.
 */
function SwatchButton({
  className = '',
  color,
  fill,
  icon,
  label,
  style,
  title,
  ...buttonProps
}: SwatchButtonProps) {
  return (
    <Button
      {...buttonProps}
      aria-label={label}
      className={[fill ? 'has-fill' : '', icon ? 'has-icon' : '', className]
        .filter(Boolean)
        .join(' ')}
      kind="swatch"
      style={
        {
          ...style,
          '--swatch-color': color,
          '--swatch-fill': fill,
        } as CSSProperties
      }
      title={title ?? label}
      variant="ghost"
    >
      {icon}
    </Button>
  )
}

export default SwatchButton
