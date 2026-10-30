import { CircleDashed, Minus } from 'lucide-react'

import { createEffect } from '../effect'
import ControlRow from './ControlRow'
import DetailsPopover from './DetailsPopover'
import IconButton from './IconButton'
import ScrubbableNumber from './ScrubbableNumber'
import SelectControl from './SelectControl'
import ShadowControls from './ShadowControls'

import type { Effect } from '../effect'

// ===== TYPES =================================================================
type EffectControlsProps = {
  label: string
  value: Exclude<Effect, { kind: 'none' }>
  onChange: (value: Effect) => void
}

// ===== CONSTANTS =============================================================
const effectKindOptions = [
  { label: 'Glow', value: 'glow' },
  { label: 'Shadow', value: 'shadow' },
] satisfies {
  label: string
  value: Effect['kind']
}[]

/** Strongest blur; wider blurs wash out and cost drawing time. */
const MAX_EFFECT_BLUR = 40

// ===== COMPONENT =============================================================
/**
 * Row of the effect of one mark: its kind, its blur (the intensity of a
 * glow), for a shadow a gear with offset, color and opacity, and a minus
 * that removes the effect. The plus in the heading of the group adds a
 * glow; the glow takes the color of the mark, so it has no gear.
 * @param props Name of the mark, effect and handler.
 */
function EffectControls({ label, value, onChange }: EffectControlsProps) {
  return (
    <ControlRow
      actions={
        <>
          {value.kind === 'shadow' ? (
            <DetailsPopover label="Shadow" size="xs">
              <ShadowControls
                label={`${label} shadow`}
                value={value}
                onChange={onChange}
              />
            </DetailsPopover>
          ) : null}
          <IconButton
            label={`Remove ${label.toLowerCase()} effect`}
            size="xs"
            variant="ghost"
            onClick={() => onChange({ kind: 'none' })}
          >
            <Minus size={14} />
          </IconButton>
        </>
      }
    >
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
        label={
          value.kind === 'glow'
            ? `${label} glow intensity`
            : `${label} shadow blur`
        }
        max={MAX_EFFECT_BLUR}
        min={value.kind === 'glow' ? 1 : 0}
        step={1}
        value={value.blur}
        onValueChange={(blur) => onChange({ ...value, blur })}
      />
    </ControlRow>
  )
}

export default EffectControls
