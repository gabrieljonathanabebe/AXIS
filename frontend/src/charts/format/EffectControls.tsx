import { CircleDashed, SquareStack, Sun } from 'lucide-react'

import { createEffect } from '@/shared/effect'
import DetailsControl from '@/shared/ui/DetailsControl'
import Group from '@/shared/ui/Group'
import Row from '@/shared/ui/Row'
import ScrubbableNumber from '@/shared/ui/ScrubbableNumber'
import SelectControl from '@/shared/ui/SelectControl'
import ShadowControls from '@/shared/ui/ShadowControls'

import type { ReactNode } from 'react'
import type { Effect } from '@/shared/effect'
import type { OptionItem } from '@/shared/ui/OptionsMenu'

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
      <Group title="Intensity">
        <Row>
          <ScrubbableNumber
            icon={<CircleDashed size={14} />}
            label={`${label} glow intensity`}
            max={MAX_EFFECT_BLUR}
            min={1}
            step={1}
            value={value.blur}
            onValueChange={(blur) => onChange({ ...value, blur })}
          />
        </Row>
      </Group>
    )
  }

  return (
    <Row
      remove={{
        label: `Remove ${label.toLowerCase()} effect`,
        onRemove: () => onChange({ kind: 'none' }),
      }}
      layout="wide"
    >
      <DetailsControl
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
      </DetailsControl>
    </Row>
  )
}

export default EffectControls
