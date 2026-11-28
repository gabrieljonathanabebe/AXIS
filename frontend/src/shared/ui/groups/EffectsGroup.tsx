import { createEffect, isEffectTaken } from '@/shared/effect'
import { SURFACE_CAPABILITIES } from '@/shared/surface'
import { EFFECT_KIND_OPTIONS } from '../rows/effectKindOptions'
import EffectRow from '../rows/EffectRow'
import Group from './Group'

import type { AnyEffect } from '@/shared/effect'
import type { OptionItem } from '@/shared/optionItem'
import type { SurfaceRenderer } from '@/shared/surface'
import type { GroupHeadProps } from './Group'

// ===== TYPES =================================================================
type EffectsGroupProps<TEffect extends AnyEffect> = GroupHeadProps & {
  /** Kinds the place offers; without them, those its renderer draws. */
  kinds?: TEffect['kind'][]
  label: string
  max?: number
  maxBlur?: number
  renderer?: SurfaceRenderer
  value: TEffect[]
  onChange: (value: TEffect[]) => void
}

// ===== CONSTANTS =============================================================
/** Widest blur of a surface effect; deep shadows need more than marks. */
const MAX_SURFACE_BLUR = 64

// ===== COMPONENT =============================================================
/**
 * Effects group of a surface or a mark: one row per effect and a plus that
 * adds the first kind, e.g. a shadow on a legend or a glow on the bars. A
 * surface offers the kinds its renderer draws (`SURFACE_CAPABILITIES`),
 * e.g. no grain in the CSS of a tooltip; a mark names its kinds, takes one
 * effect (`max`) and blurs less. A blur or noise is offered once per list.
 * @param props Heading, kinds or renderer, name, limits, effects and
 *   handler.
 */
function EffectsGroup<TEffect extends AnyEffect>({
  group,
  kinds,
  label,
  max = Infinity,
  maxBlur = MAX_SURFACE_BLUR,
  renderer = 'html',
  title = 'Effects',
  value,
  visibility,
  onChange,
}: EffectsGroupProps<TEffect>) {
  const offeredKinds =
    kinds ?? (SURFACE_CAPABILITIES[renderer].effects as TEffect['kind'][])

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
      return offeredKinds.includes(option.value)
    }).map((option) => ({
      ...option,
      disabled:
        option.value !== effect.kind && isEffectTaken(value, option.value),
    }))
  }

  return (
    <Group
      group={group}
      title={title}
      visibility={visibility}
      onAdd={
        value.length < max
          ? () => onChange([...value, createEffect(offeredKinds[0]) as TEffect])
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
              onChange={(next) => onChange(value.with(index, next as TEffect))}
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
