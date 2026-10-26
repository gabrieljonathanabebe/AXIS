import { Blend } from 'lucide-react'

import ColorField from './ColorField'
import ControlRow from './ControlRow'
import ScrubbableNumber from './ScrubbableNumber'

import type { ReactNode } from 'react'
import type { ColorValue } from '../colorValue'
import type { ColorPreset } from './ColorControl'

// ===== TYPES =================================================================
/** Own color of a paint, with the swatches of its place. */
export type PaintColor = {
  presets: ColorPreset[]
  value: ColorValue
  onChange: (value: ColorValue) => void
}

type PaintControlProps = {
  /** Own color; a series paint has none. */
  color?: PaintColor
  label: string
  opacity: number
  /** Field of the series color for a paint without own color. */
  seriesColor?: ReactNode
  onOpacityChange: (opacity: number) => void
}

// ===== COMPONENT =============================================================
/**
 * Color row of a fill or stroke: the color field, then the opacity in
 * percent. A paint with its own color shows a `ColorField`; a series paint
 * shows the field of the series color, e.g. its palette, if given.
 * @param props Own or series color, opacity and its handler.
 */
function PaintControl({
  color,
  label,
  opacity,
  seriesColor,
  onOpacityChange,
}: PaintControlProps) {
  return (
    <ControlRow>
      {color ? (
        <ColorField
          label={label}
          presets={color.presets}
          value={color.value}
          onChange={color.onChange}
        />
      ) : (
        seriesColor
      )}
      <ScrubbableNumber
        icon={<Blend size={14} />}
        label={`${label} opacity`}
        max={100}
        min={5}
        step={1}
        unit="%"
        value={Math.round(opacity * 100)}
        onValueChange={(percent) => onOpacityChange(percent / 100)}
      />
    </ControlRow>
  )
}

export default PaintControl
