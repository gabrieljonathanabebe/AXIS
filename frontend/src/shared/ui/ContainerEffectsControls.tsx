import { Blend, CircleDashed, Minus, Scaling } from 'lucide-react'

import {
  createContainerEffect,
  isContainerEffectTaken,
  sortContainerEffects,
} from '../effect'
import ControlRow from './ControlRow'
import DetailsPopover from './DetailsPopover'
import IconButton from './IconButton'
import ScrubbableNumber from './ScrubbableNumber'
import SelectControl from './SelectControl'
import ShadowControls from './ShadowControls'

import type { ReactNode } from 'react'
import type { ContainerEffect } from '../effect'

// ===== TYPES =================================================================
type ContainerEffectsControlsProps = {
  label: string
  value: ContainerEffect[]
  onChange: (value: ContainerEffect[]) => void
}

// ===== CONSTANTS =============================================================
const effectKindOptions = [
  { label: 'Shadow', value: 'shadow' },
  { label: 'Inner shadow', value: 'innerShadow' },
  { label: 'Blur', value: 'backgroundBlur' },
  { label: 'Noise', value: 'noise' },
] satisfies {
  label: string
  value: ContainerEffect['kind']
}[]

/** Widest blur of a container effect; deep shadows need more than marks. */
const MAX_CONTAINER_BLUR = 64

/** Smallest and largest grain tile, in px. */
const MIN_NOISE_SIZE = 20
const MAX_NOISE_SIZE = 400

// ===== COMPONENT =============================================================
/**
 * Rows of the effects of a container in their layers from the bottom:
 * kind | main value | gear | minus. The main value is the blur, for noise
 * its intensity; the gear holds offset and color of a shadow or the size
 * of the grain. Blur and noise are offered once per container.
 * @param props Name of the container, its effects and handler.
 */
function ContainerEffectsControls({
  label,
  value,
  onChange,
}: ContainerEffectsControlsProps) {
  // ===== FUNCTIONS ===========================================================
  /**
   * Saves one changed effect; the list stays sorted by its layers.
   * @param index Position of the effect in the list.
   * @param effect Changed effect, e.g. of another kind.
   */
  function setEffect(index: number, effect: ContainerEffect): void {
    onChange(sortContainerEffects(value.with(index, effect)))
  }

  /**
   * Number next to the kind: the blur, for noise its intensity.
   * @param effect Effect of the row.
   * @param index Position of the effect in the list.
   * @returns The number field of the row.
   */
  function getMainValue(effect: ContainerEffect, index: number): ReactNode {
    if (effect.kind === 'noise') {
      return (
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
      )
    }
    return (
      <ScrubbableNumber
        icon={<CircleDashed size={14} />}
        label={`${label} effect ${index + 1} blur`}
        max={MAX_CONTAINER_BLUR}
        min={0}
        step={1}
        value={effect.blur}
        onValueChange={(blur) => setEffect(index, { ...effect, blur })}
      />
    )
  }

  /**
   * Gear of the row: offset and color of a shadow, the size of the grain;
   * a background blur has nothing more.
   * @param effect Effect of the row.
   * @param index Position of the effect in the list.
   * @returns The gear with its popover, or nothing.
   */
  function getDetails(effect: ContainerEffect, index: number): ReactNode {
    if (effect.kind === 'shadow' || effect.kind === 'innerShadow') {
      return (
        <DetailsPopover
          label={effect.kind === 'shadow' ? 'Shadow' : 'Inner shadow'}
          size="xs"
        >
          <ShadowControls
            label={`${label} effect ${index + 1}`}
            value={effect}
            onChange={(shadow) => setEffect(index, shadow)}
          />
        </DetailsPopover>
      )
    }
    if (effect.kind === 'noise') {
      return (
        <DetailsPopover label="Noise" size="xs">
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
        </DetailsPopover>
      )
    }
    return null
  }

  // ===== JSX RETURN ==========================================================
  return value.map((effect, index) => (
    <ControlRow
      // Effects carry no id; the list only changes by its own rows.
      key={index}
      actions={
        <>
          {getDetails(effect, index)}
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
        </>
      }
    >
      <SelectControl
        label={`${label} effect ${index + 1}`}
        options={effectKindOptions.map((option) => ({
          ...option,
          disabled:
            option.value !== effect.kind &&
            isContainerEffectTaken(value, option.value),
        }))}
        value={effect.kind}
        onChange={(kind) => {
          if (kind !== effect.kind) {
            setEffect(index, createContainerEffect(kind))
          }
        }}
      />
      {getMainValue(effect, index)}
    </ControlRow>
  ))
}

export default ContainerEffectsControls
