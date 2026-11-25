import { Blend, CircleDashed, Scaling } from 'lucide-react'

import { createEffect } from '@/shared/effect'
import NumberControl from '../controls/NumberControl'
import SelectControl from '../controls/SelectControl'
import Group from '../groups/Group'
import ShadowControls from '../groups/ShadowControls'
import Row from '../rows/Row'

import type { ReactNode } from 'react'
import type { AnyEffect } from '@/shared/effect'
import type { OptionItem } from '../primitives/SelectMenu'

// ===== TYPES =================================================================
type EffectEditorProps = {
  kinds: OptionItem<AnyEffect['kind']>[]
  label: string
  maxBlur: number
  value: AnyEffect
  onChange: (value: AnyEffect) => void
}

// ===== CONSTANTS =============================================================
/** Smallest and largest grain tile, in px. */
const MIN_NOISE_SIZE = 20
const MAX_NOISE_SIZE = 400

// ===== COMPONENT =============================================================
/**
 * Editor of one effect: the kind select as its title, then the values of
 * the kind, e.g. offset, blur and color of a shadow or the intensity of a
 * glow. A new kind starts with its default values.
 * @param props Offered kinds, name of the effect, widest blur of the
 *   place, effect and handler.
 */
function EffectEditor({
  kinds,
  label,
  maxBlur,
  value,
  onChange,
}: EffectEditorProps) {
  /**
   * Values of the effect below its kind: the intensity of a glow, the blur
   * of a background blur, intensity and size of the grain, or offset, blur
   * and color of a shadow.
   * @returns The groups of the effect.
   */
  function getValues(): ReactNode {
    switch (value.kind) {
      case 'glow':
        return (
          <Group title="Intensity">
            <Row>
              <NumberControl
                icon={<CircleDashed size={14} />}
                label={`${label} intensity`}
                max={maxBlur}
                min={1}
                value={value.blur}
                onValueChange={(blur) => onChange({ ...value, blur })}
              />
            </Row>
          </Group>
        )
      case 'backgroundBlur':
        return (
          <Group title="Blur">
            <Row>
              <NumberControl
                icon={<CircleDashed size={14} />}
                label={`${label} blur`}
                max={maxBlur}
                min={0}
                value={value.blur}
                onValueChange={(blur) => onChange({ ...value, blur })}
              />
            </Row>
          </Group>
        )
      case 'noise':
        return (
          <Group title="Grain">
            <Row>
              <NumberControl
                icon={<Blend size={14} />}
                label={`${label} intensity`}
                max={100}
                min={1}
                unit="%"
                value={Math.round(value.opacity * 100)}
                onValueChange={(percent) => {
                  onChange({ ...value, opacity: percent / 100 })
                }}
              />
              <NumberControl
                icon={<Scaling size={14} />}
                label={`${label} size`}
                max={MAX_NOISE_SIZE}
                min={MIN_NOISE_SIZE}
                step={10}
                unit="px"
                value={value.size}
                onValueChange={(size) => onChange({ ...value, size })}
              />
            </Row>
          </Group>
        )
      default:
        return (
          <ShadowControls
            label={label}
            maxBlur={maxBlur}
            value={value}
            onChange={onChange}
          />
        )
    }
  }

  return (
    <>
      <SelectControl
        label={`${label} kind`}
        options={kinds}
        value={value.kind}
        variant="title"
        onChange={(kind) => {
          if (kind !== value.kind) {
            onChange(createEffect(kind))
          }
        }}
      />
      {getValues()}
    </>
  )
}

export default EffectEditor
