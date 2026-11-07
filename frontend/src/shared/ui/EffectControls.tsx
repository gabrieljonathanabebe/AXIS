import { CircleDashed, Minus, SquareStack, Sun } from 'lucide-react'

import { createEffect } from '../effect'
import ControlRow from './ControlRow'
import DetailsField from './DetailsField'
import FormatWidget from './FormatWidget'
import IconButton from './IconButton'
import ScrubbableNumber from './ScrubbableNumber'
import SelectControl from './SelectControl'
import ShadowControls from './ShadowControls'

import type { ReactNode } from 'react'
import type { Effect } from '../effect'
import type { OptionItem } from './OptionsMenu'

// ===== TYPES =================================================================
type EffectControlsProps = {
  label: string
  value: Exclude<Effect, { kind: 'none' }>
  onChange: (value: Effect) => void
}

// ===== CONSTANTS =============================================================
const effectKindOptions = [
  { icon: Sun, label: 'Glow', value: 'glow' },
  { icon: SquareStack, label: 'Shadow', value: 'shadow' },
] satisfies OptionItem<Effect['kind']>[]

/** Strongest blur; wider blurs wash out and cost drawing time. */
const MAX_EFFECT_BLUR = 40

// ===== COMPONENT =============================================================
/**
 * Row of the effect of one mark, built like a paint: a field with icon
 * and name of its kind opens the editor, which starts with the kind and
 * holds the values below it; a minus removes the effect. The plus in the
 * heading of the group adds a glow, which takes the color of the mark.
 * @param props Name of the mark, effect and handler.
 */
function EffectControls({ label, value, onChange }: EffectControlsProps) {
  const kind = effectKindOptions.find((option) => option.value === value.kind)

  /**
   * Values of the effect below its kind: the intensity of a glow, or
   * offset, blur and color of a shadow.
   * @returns The groups of the effect.
   */
  function getValues(): ReactNode {
    if (value.kind === 'shadow') {
      return (
        <ShadowControls
          label={`${label} shadow`}
          maxBlur={MAX_EFFECT_BLUR}
          value={value}
          onChange={onChange}
        />
      )
    }
    return (
      <FormatWidget title="Intensity">
        <ControlRow>
          <ScrubbableNumber
            icon={<CircleDashed size={14} />}
            label={`${label} glow intensity`}
            max={MAX_EFFECT_BLUR}
            min={1}
            step={1}
            value={value.blur}
            onValueChange={(blur) => onChange({ ...value, blur })}
          />
        </ControlRow>
      </FormatWidget>
    )
  }

  return (
    <ControlRow
      action={
        <IconButton
          label={`Remove ${label.toLowerCase()} effect`}
          size="xs"
          variant="ghost"
          onClick={() => onChange({ kind: 'none' })}
        >
          <Minus size={14} />
        </IconButton>
      }
      layout="wide"
    >
      <DetailsField
        icon={kind ? <kind.icon size={14} /> : null}
        label={`${label} effect`}
        text={kind?.label ?? ''}
      >
        <SelectControl
          label={`${label} effect kind`}
          options={effectKindOptions}
          value={value.kind}
          variant="title"
          onChange={(nextKind) => {
            if (nextKind !== value.kind) {
              onChange(createEffect(nextKind))
            }
          }}
        />
        {getValues()}
      </DetailsField>
    </ControlRow>
  )
}

export default EffectControls
