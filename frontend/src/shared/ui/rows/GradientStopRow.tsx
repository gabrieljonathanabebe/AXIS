import { Blend, Minus, MoveHorizontal } from 'lucide-react'

import ColorControl from '../controls/ColorControl'
import NumberControl from '../controls/NumberControl'
import IconButton from '../primitives/IconButton'

import type { GradientStop } from '@/shared/paint'
import type { ColorPreset } from '../controls/colorPresets'

// ===== TYPES =================================================================
type GradientStopRowProps = {
  isRemovable: boolean
  label: string
  presets: ColorPreset[]
  value: GradientStop
  onChange: (value: GradientStop) => void
  onRemove: () => void
}

// ===== COMPONENT =============================================================
/**
 * Row of one gradient stop: its color as a swatch with the presets of the
 * place, its position and opacity in percent and a minus, which stays
 * disabled while the gradient has only its start and end.
 * @param props Removability, name of the stop, swatches, stop and
 *   handlers.
 */
function GradientStopRow({
  isRemovable,
  label,
  presets,
  value,
  onChange,
  onRemove,
}: GradientStopRowProps) {
  return (
    <div className="gradient-stop">
      <ColorControl
        label={label}
        presets={presets}
        swatchOnly
        value={value.color}
        onChange={(color) => onChange({ ...value, color })}
      />
      <NumberControl
        icon={<MoveHorizontal size={14} />}
        label={`${label} position`}
        max={100}
        min={0}
        unit="%"
        value={Math.round(value.position * 100)}
        onValueChange={(percent) => {
          onChange({ ...value, position: percent / 100 })
        }}
      />
      <NumberControl
        icon={<Blend size={14} />}
        label={`${label} opacity`}
        max={100}
        min={0}
        unit="%"
        value={Math.round(value.opacity * 100)}
        onValueChange={(percent) => {
          onChange({ ...value, opacity: percent / 100 })
        }}
      />
      <IconButton
        disabled={!isRemovable}
        label={`Remove ${label}`}
        size="sm"
        variant="ghost"
        onClick={onRemove}
      >
        <Minus size={14} />
      </IconButton>
    </div>
  )
}

export default GradientStopRow
