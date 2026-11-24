import { HexColorInput } from 'react-colorful'

import { getColorValueKey, normalizeHex } from '@/shared/colorValue'
import ColorEditor from '../containers/ColorEditor'
import Popover from '../primitives/Popover'
import SwatchButton from '../primitives/SwatchButton'
import { getPresetFill, getSwatchColor } from './colorPresets'

import type { ReactNode } from 'react'
import type { ColorValue } from '@/shared/colorValue'
import type { ColorPreset } from './colorPresets'

// ===== TYPES =================================================================
type ColorControlProps<TPreset extends string = never> = {
  label: string
  presets?: ColorPreset<TPreset>[]
  swatch?: ReactNode
  /** Only the swatch, without frame and value, e.g. in a gradient stop. */
  swatchOnly?: boolean
  value: ColorValue | NoInfer<TPreset>
  onChange: (value: ColorValue | NoInfer<TPreset>) => void
}

// ===== HELPERS ===============================================================
/**
 * Names a theme color or a named preset by its swatch, e.g. "Chart 2" or
 * "Glass".
 * @param value Color or preset name of the field.
 * @param presets Swatches of the place.
 * @returns Label of the matching swatch, otherwise "Theme".
 */
function getSwatchLabel(
  value: ColorValue | string,
  presets: ColorPreset<string>[],
): string {
  const swatch = presets.find((preset) =>
    typeof value === 'string' || typeof preset.value === 'string'
      ? preset.value === value
      : getColorValueKey(preset.value) === getColorValueKey(value),
  )
  return swatch?.label ?? 'Theme'
}

// ===== COMPONENT =============================================================
/**
 * Control of one color: swatch with the color picker, then the hex value of
 * an own color or the swatch name of a theme color or named preset, e.g.
 * the glass background of a container. A given `swatch` takes the place
 * of the picker, e.g. the swatch of a paint that opens its editor;
 * `swatchOnly` leaves out frame and value, e.g. in a gradient stop.
 * @param props Name, swatches, color, swatch, form and handler.
 */
function ColorControl<TPreset extends string = never>({
  label,
  presets = [],
  swatch,
  swatchOnly = false,
  value,
  onChange,
}: ColorControlProps<TPreset>) {
  const swatchLabel = `${label} color`
  const picker = swatch ?? (
    <Popover
      label={`${swatchLabel} color`}
      renderTrigger={(triggerProps) => (
        <SwatchButton
          {...triggerProps}
          color={getSwatchColor(value)}
          fill={getPresetFill(value, presets)}
          label={swatchLabel}
        />
      )}
      variant="editor"
    >
      <ColorEditor
        label={swatchLabel}
        presets={presets}
        value={value}
        onChange={onChange}
      />
    </Popover>
  )
  if (swatchOnly) {
    return picker
  }
  return (
    <div className="control-frame swatch-control">
      {picker}
      {typeof value !== 'string' && value.kind === 'custom' ? (
        <HexColorInput
          className="swatch-control-hex"
          color={value.color}
          aria-label={`${label} hex value`}
          onChange={(hex) => {
            onChange({ kind: 'custom', color: normalizeHex(hex) })
          }}
        />
      ) : (
        <span className="swatch-control-name">
          {getSwatchLabel(value, presets)}
        </span>
      )}
    </div>
  )
}

export default ColorControl
