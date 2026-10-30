import { useState } from 'react'

import { getPaintCss } from '../paint'
import Button from './Button'
import ColorField from './ColorField'
import DetailsPopover from './DetailsPopover'

import type { CSSProperties, ReactNode } from 'react'
import type { GradientType, Paint } from '../paint'
import type { ColorPreset } from './colorPresets'

// ===== TYPES =================================================================
type PaintFieldProps = {
  children?: ReactNode
  label: string
  open?: boolean
  presets: ColorPreset[]
  value: Paint
  onChange: (value: Paint) => void
  onOpenChange?: (open: boolean) => void
}

// ===== CONSTANTS =============================================================
const GRADIENT_TYPE_LABELS = {
  linear: 'Linear',
  radial: 'Radial',
} satisfies Record<GradientType, string>

// ===== COMPONENT =============================================================
/**
 * Field of a paint with its own color. Its swatch shows the paint itself,
 * a gradient included; next to it stands the hex value of a solid color
 * or the type of a gradient. Given `children`, the swatch opens them as
 * the editor of the paint, e.g. type, stops and center; without, the
 * paint is solid and the field a plain `ColorField`. `open` and
 * `onOpenChange` let a list open the editor itself, e.g. after adding;
 * otherwise the field keeps it open across a switch between solid and
 * gradient, which swaps the field around the swatch.
 * @param props Name, swatches, paint, editor, open state and handlers.
 */
function PaintField({
  children,
  label,
  open,
  presets,
  value,
  onChange,
  onOpenChange,
}: PaintFieldProps) {
  const [ownOpen, setOwnOpen] = useState(false)
  const isOpen = open ?? ownOpen
  const setIsOpen = onOpenChange ?? setOwnOpen
  if (!children && value.kind === 'solid') {
    return (
      <ColorField
        label={label}
        presets={presets}
        value={value.color}
        onChange={(color) => onChange({ ...value, color })}
      />
    )
  }
  const swatch = (
    <div className="color-swatch">
      <DetailsPopover
        hasHeader={false}
        label={label}
        open={isOpen}
        onOpenChange={setIsOpen}
        renderTrigger={(triggerProps) => (
          <Button
            {...triggerProps}
            className="color-swatch-swatch has-fill"
            type="button"
            aria-label={`Edit ${label.toLowerCase()}`}
            title={label}
            style={{ '--swatch-fill': getPaintCss(value) } as CSSProperties}
          />
        )}
      >
        {children}
      </DetailsPopover>
    </div>
  )
  if (value.kind === 'solid') {
    return (
      <ColorField
        label={label}
        presets={presets}
        swatch={swatch}
        value={value.color}
        onChange={(color) => onChange({ ...value, color })}
      />
    )
  }
  return (
    <div className="field color-field">
      {swatch}
      <span className="color-field-name">
        {GRADIENT_TYPE_LABELS[value.type]}
      </span>
    </div>
  )
}

export default PaintField
