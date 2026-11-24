import { useState } from 'react'

import { getPaintCss, PAINT_TYPE_LABELS } from '@/shared/paint'
import Editor from '../containers/Editor'
import Button from '../primitives/Button'
import Popover from '../primitives/Popover'
import ColorControl from './ColorControl'

import type { CSSProperties, ReactNode } from 'react'
import type { Paint } from '@/shared/paint'
import type { ColorPreset } from './colorPresets'

// ===== TYPES =================================================================
type PaintControlProps = {
  children?: ReactNode
  label: string
  open?: boolean
  presets: ColorPreset[]
  value: Paint
  onChange: (value: Paint) => void
  onOpenChange?: (open: boolean) => void
}

// ===== COMPONENT =============================================================
/**
 * Control of a paint with its own color. Its swatch shows the paint itself,
 * a gradient included; next to it stands the hex value of a solid color
 * or the type of a gradient. Given `children`, the swatch opens them as
 * the editor of the paint, e.g. type, stops and center; without, the
 * paint is solid and the control a plain `ColorControl`. `open` and
 * `onOpenChange` let a list open the editor itself, e.g. after adding;
 * otherwise the field keeps it open across a switch between solid and
 * gradient, which swaps the field around the swatch.
 * @param props Name, swatches, paint, editor, open state and handlers.
 */
function PaintControl({
  children,
  label,
  open,
  presets,
  value,
  onChange,
  onOpenChange,
}: PaintControlProps) {
  const [ownOpen, setOwnOpen] = useState(false)
  const isOpen = open ?? ownOpen
  const setIsOpen = onOpenChange ?? setOwnOpen
  if (!children && value.kind === 'solid') {
    return (
      <ColorControl
        label={label}
        presets={presets}
        value={value.color}
        onChange={(color) => onChange({ ...value, color })}
      />
    )
  }
  const swatch = (
    <div className="color-swatch">
      <Popover
        label={label}
        open={isOpen}
        variant="editor"
        onOpenChange={setIsOpen}
        renderTrigger={(triggerProps) => (
          <Button
            {...triggerProps}
            className="color-swatch-swatch has-fill"
            aria-label={`Edit ${label.toLowerCase()}`}
            title={label}
            style={{ '--swatch-fill': getPaintCss(value) } as CSSProperties}
          />
        )}
      >
        <Editor>{children}</Editor>
      </Popover>
    </div>
  )
  if (value.kind === 'solid') {
    return (
      <ColorControl
        label={label}
        presets={presets}
        swatch={swatch}
        value={value.color}
        onChange={(color) => onChange({ ...value, color })}
      />
    )
  }
  return (
    <div className="control-frame swatch-control">
      {swatch}
      <span className="swatch-control-name">
        {PAINT_TYPE_LABELS[value.type]}
      </span>
    </div>
  )
}

export default PaintControl
