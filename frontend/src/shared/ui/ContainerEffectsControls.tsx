import {
  Blend,
  CircleDashed,
  Droplet,
  Grip,
  Minus,
  Scaling,
  SquareSquare,
  SquareStack,
} from 'lucide-react'

import { createContainerEffect, isContainerEffectTaken } from '../effect'
import ControlRow from './ControlRow'
import DetailsField from './DetailsField'
import FormatWidget from './FormatWidget'
import IconButton from './IconButton'
import ScrubbableNumber from './ScrubbableNumber'
import SelectControl from './SelectControl'
import ShadowControls from './ShadowControls'

import type { ReactNode } from 'react'
import type { ContainerEffect } from '../effect'
import type { OptionItem } from './OptionsMenu'

// ===== TYPES =================================================================
type ContainerEffectsControlsProps = {
  label: string
  value: ContainerEffect[]
  onChange: (value: ContainerEffect[]) => void
}

// ===== CONSTANTS =============================================================
const effectKindOptions = [
  { icon: SquareStack, label: 'Shadow', value: 'shadow' },
  { icon: SquareSquare, label: 'Inner shadow', value: 'innerShadow' },
  { icon: Droplet, label: 'Blur', value: 'backgroundBlur' },
  { icon: Grip, label: 'Noise', value: 'noise' },
] satisfies OptionItem<ContainerEffect['kind']>[]

/** Widest blur of a container effect; deep shadows need more than marks. */
const MAX_CONTAINER_BLUR = 64

/** Smallest and largest grain tile, in px. */
const MIN_NOISE_SIZE = 20
const MAX_NOISE_SIZE = 400

// ===== COMPONENT =============================================================
/**
 * Rows of the effects of a container in their layers from the bottom,
 * built like paints: a field with icon and name of the kind opens the
 * editor, which starts with the kind and holds the values below it, and
 * a minus removes the effect. Blur and noise are offered once per
 * container.
 * @param props Name of the container, its effects and handler.
 */
function ContainerEffectsControls({
  label,
  value,
  onChange,
}: ContainerEffectsControlsProps) {
  // ===== FUNCTIONS ===========================================================
  /**
   * Saves one changed effect at its place; the list keeps the order the
   * user gave it, like in Figma, since the kind alone fixes its layer.
   * @param index Position of the effect in the list.
   * @param effect Changed effect, e.g. of another kind.
   */
  function setEffect(index: number, effect: ContainerEffect): void {
    onChange(value.with(index, effect))
  }

  /**
   * Values of an effect below its kind: offset, blur and color of a
   * shadow, the blur of a background blur, intensity and size of the
   * grain.
   * @param effect Effect of the row.
   * @param index Position of the effect in the list.
   * @returns The groups of the effect.
   */
  function getValues(effect: ContainerEffect, index: number): ReactNode {
    if (effect.kind === 'shadow' || effect.kind === 'innerShadow') {
      return (
        <ShadowControls
          label={`${label} effect ${index + 1}`}
          maxBlur={MAX_CONTAINER_BLUR}
          value={effect}
          onChange={(shadow) => setEffect(index, shadow)}
        />
      )
    }
    if (effect.kind === 'backgroundBlur') {
      return (
        <FormatWidget title="Blur">
          <ControlRow>
            <ScrubbableNumber
              icon={<CircleDashed size={14} />}
              label={`${label} effect ${index + 1} blur`}
              max={MAX_CONTAINER_BLUR}
              min={0}
              step={1}
              value={effect.blur}
              onValueChange={(blur) => setEffect(index, { ...effect, blur })}
            />
          </ControlRow>
        </FormatWidget>
      )
    }
    return (
      <FormatWidget title="Grain">
        <ControlRow>
          <ScrubbableNumber
            icon={<Blend size={14} />}
            label={`${label} effect ${index + 1} intensity`}
            max={100}
            min={1}
            step={1}
            unit="%"
            value={Math.round(effect.opacity * 100)}
            onValueChange={(percent) => {
              setEffect(index, { ...effect, opacity: percent / 100 })
            }}
          />
          <ScrubbableNumber
            icon={<Scaling size={14} />}
            label={`${label} effect ${index + 1} size`}
            max={MAX_NOISE_SIZE}
            min={MIN_NOISE_SIZE}
            step={10}
            unit="px"
            value={effect.size}
            onValueChange={(size) => setEffect(index, { ...effect, size })}
          />
        </ControlRow>
      </FormatWidget>
    )
  }

  // ===== JSX RETURN ==========================================================
  return value.map((effect, index) => {
    const kind = effectKindOptions.find(
      (option) => option.value === effect.kind,
    )
    return (
      <ControlRow
        // Effects carry no id; the list only changes by its own rows.
        key={index}
        action={
          <IconButton
            label={`Remove ${label.toLowerCase()} effect ${index + 1}`}
            size="xs"
            variant="ghost"
            onClick={() => {
              onChange(value.filter((other) => other !== effect))
            }}
          >
            <Minus size={14} />
          </IconButton>
        }
        layout="wide"
      >
        <DetailsField
          icon={kind ? <kind.icon size={14} /> : null}
          label={`${label} effect ${index + 1}`}
          text={kind?.label ?? ''}
        >
          <SelectControl
            label={`${label} effect ${index + 1} kind`}
            options={effectKindOptions.map((option) => ({
              ...option,
              disabled:
                option.value !== effect.kind &&
                isContainerEffectTaken(value, option.value),
            }))}
            value={effect.kind}
            variant="title"
            onChange={(nextKind) => {
              if (nextKind !== effect.kind) {
                setEffect(index, createContainerEffect(nextKind))
              }
            }}
          />
          {getValues(effect, index)}
        </DetailsField>
      </ControlRow>
    )
  })
}

export default ContainerEffectsControls
