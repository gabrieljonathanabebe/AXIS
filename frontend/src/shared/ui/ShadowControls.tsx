import { Blend } from 'lucide-react'

import ColorField from './ColorField'
import ControlRow from './ControlRow'
import FormatWidget from './FormatWidget'
import ScrubbableNumber from './ScrubbableNumber'

import type { Shadow } from '../effect'

// ===== TYPES =================================================================
type ShadowControlsProps<TValue extends Shadow> = {
  label: string
  value: TValue
  onChange: (value: TValue) => void
}

// ===== CONSTANTS =============================================================
/** Widest offset of a shadow in either direction, in px. */
const MAX_SHADOW_OFFSET = 40

// ===== COMPONENT =============================================================
/**
 * Details of a shadow behind its gear: the offset to the right and down,
 * then color and opacity. The blur stays in the row of the effect, so
 * marks and containers show it at a glance.
 * @param props Name for screen readers, shadow and handler; the shadow
 *   keeps its other fields, e.g. its kind.
 */
function ShadowControls<TValue extends Shadow>({
  label,
  value,
  onChange,
}: ShadowControlsProps<TValue>) {
  return (
    <>
      <FormatWidget title="Offset">
        <ControlRow>
          <ScrubbableNumber
            icon="X"
            label={`${label} x offset`}
            max={MAX_SHADOW_OFFSET}
            min={-MAX_SHADOW_OFFSET}
            step={1}
            value={value.offsetX}
            onValueChange={(offsetX) => onChange({ ...value, offsetX })}
          />
          <ScrubbableNumber
            icon="Y"
            label={`${label} y offset`}
            max={MAX_SHADOW_OFFSET}
            min={-MAX_SHADOW_OFFSET}
            step={1}
            value={value.offsetY}
            onValueChange={(offsetY) => onChange({ ...value, offsetY })}
          />
        </ControlRow>
      </FormatWidget>
      <FormatWidget title="Color">
        <ControlRow>
          <ColorField
            label={label}
            presets={[]}
            value={value.color}
            onChange={(color) => onChange({ ...value, color })}
          />
          <ScrubbableNumber
            icon={<Blend size={14} />}
            label={`${label} opacity`}
            max={100}
            min={0}
            step={1}
            unit="%"
            value={Math.round(value.opacity * 100)}
            onValueChange={(percent) => {
              onChange({ ...value, opacity: percent / 100 })
            }}
          />
        </ControlRow>
      </FormatWidget>
    </>
  )
}

export default ShadowControls
