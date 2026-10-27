import { CircleDashed, Minus } from 'lucide-react'

import { createEffect } from '../effect'
import ControlRow from './ControlRow'
import IconButton from './IconButton'
import ScrubbableNumber from './ScrubbableNumber'
import SelectControl from './SelectControl'

import type { Effect } from '../effect'

// ===== TYPES =================================================================
type EffectControlsProps = {
  label: string
  value: Exclude<Effect, { kind: 'none' }>
  onChange: (value: Effect) => void
}

// ===== CONSTANTS =============================================================
const effectKindOptions = [{ label: 'Glow', value: 'glow' }] satisfies {
  label: string
  value: Effect['kind']
}[]

/** Strongest glow; wider blurs wash out and cost drawing time. */
const MAX_GLOW_BLUR = 40

// ===== COMPONENT =============================================================
/**
 * Row of the effect of one mark: its kind, for a glow its intensity as
 * blur, and a minus that removes the effect. The plus in the heading of
 * the group adds it; the glow takes the color of the mark, so there is no
 * color field.
 */
function EffectControls({ label, value, onChange }: EffectControlsProps) {
  return (
    <ControlRow>
      <SelectControl
        label={`${label} effect`}
        options={effectKindOptions}
        value={value.kind}
        onChange={(kind) => {
          if (kind !== value.kind) {
            onChange(createEffect(kind))
          }
        }}
      />
      <ScrubbableNumber
        icon={<CircleDashed size={14} />}
        label={`${label} glow intensity`}
        max={MAX_GLOW_BLUR}
        min={1}
        step={1}
        value={value.blur}
        onValueChange={(blur) => onChange({ ...value, blur })}
      />
      <IconButton
        label={`Remove ${label.toLowerCase()} effect`}
        size="sm"
        variant="ghost"
        onClick={() => onChange({ kind: 'none' })}
      >
        <Minus size={14} />
      </IconButton>
    </ControlRow>
  )
}

export default EffectControls
