import { createEffect, isEffectTaken } from '@/shared/effect'
import { EFFECT_KIND_OPTIONS } from '../rows/effectKindOptions'
import EffectRow from '../rows/EffectRow'
import Group from './Group'

import type { AnyEffect } from '@/shared/effect'
import type { OptionItem } from '@/shared/optionItem'

// ===== TYPES =================================================================
type EffectsGroupProps = {
  kinds: AnyEffect['kind'][]
  label: string
  max?: number
  maxBlur: number
  title: string
  value: AnyEffect[]
  onChange: (value: AnyEffect[]) => void
}

// ===== COMPONENT =============================================================
/**
 * Group of the effects of a mark or a surface: one row per effect and a
 * plus that adds the first of the `kinds`, e.g. a glow on a mark or a
 * shadow on a container. The place sets its kinds, how many effects it
 * takes (`max`, one per mark) and its widest blur; a blur or noise is
 * offered once per list.
 * @param props Kinds, name of the place, limits, title, effects and
 *   handler.
 */
function EffectsGroup({
  kinds,
  label,
  max = Infinity,
  maxBlur,
  title,
  value,
  onChange,
}: EffectsGroupProps) {
  /**
   * Name of one effect for screen readers, numbered only where the list
   * takes several, e.g. "Container effect 2".
   * @param index Position of the effect in the list.
   * @returns The name of the effect.
   */
  function getEffectLabel(index: number): string {
    return max === 1 ? `${label} effect` : `${label} effect ${index + 1}`
  }

  /**
   * Kinds the select of one effect offers; a single kind another effect
   * already has stays visible but disabled.
   * @param effect Effect of the row.
   * @returns The kind options of the row.
   */
  function getKindOptions(effect: AnyEffect): OptionItem<AnyEffect['kind']>[] {
    return EFFECT_KIND_OPTIONS.filter((option) => {
      return kinds.includes(option.value)
    }).map((option) => ({
      ...option,
      disabled:
        option.value !== effect.kind && isEffectTaken(value, option.value),
    }))
  }

  return (
    <Group
      title={title}
      onAdd={
        value.length < max
          ? () => onChange([...value, createEffect(kinds[0])])
          : undefined
      }
    >
      {value.length > 0
        ? value.map((effect, index) => (
            <EffectRow
              // Effects carry no id; the list only changes by its own rows.
              key={index}
              kinds={getKindOptions(effect)}
              label={getEffectLabel(index)}
              maxBlur={maxBlur}
              value={effect}
              onChange={(next) => onChange(value.with(index, next))}
              onRemove={() => {
                onChange(value.filter((other) => other !== effect))
              }}
            />
          ))
        : null}
    </Group>
  )
}

export default EffectsGroup
