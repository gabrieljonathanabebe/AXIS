import { Blend, CircleDashed } from 'lucide-react'

import ColorField from './ColorField'
import Group from './Group'
import Row from './Row'
import ScrubbableNumber from './ScrubbableNumber'

import type { Shadow } from '@/shared/effect'

// ===== TYPES =================================================================
type ShadowControlsProps<TValue extends Shadow> = {
  label: string
  maxBlur: number
  value: TValue
  onChange: (value: TValue) => void
}

// ===== CONSTANTS =============================================================
/** Widest offset of a shadow in either direction, in px. */
const MAX_SHADOW_OFFSET = 40

// ===== COMPONENT =============================================================
/**
 * Details of a shadow behind its gear: the offset to the right and down,
 * the blur, then color and opacity. The row of the effect shows only its
 * kind, like in Figma.
 * @param props Name for screen readers, widest blur, shadow and handler;
 *   the shadow keeps its other fields, e.g. its kind.
 */
function ShadowControls<TValue extends Shadow>({
  label,
  maxBlur,
  value,
  onChange,
}: ShadowControlsProps<TValue>) {
  return (
    <>
      <Group title="Offset">
        <Row>
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
        </Row>
      </Group>
      <Group title="Blur">
        <Row>
          <ScrubbableNumber
            icon={<CircleDashed size={14} />}
            label={`${label} blur`}
            max={maxBlur}
            min={0}
            step={1}
            value={value.blur}
            onValueChange={(blur) => onChange({ ...value, blur })}
          />
        </Row>
      </Group>
      <Group title="Color">
        <Row>
          <ColorField
            label={label}
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
        </Row>
      </Group>
    </>
  )
}

export default ShadowControls
