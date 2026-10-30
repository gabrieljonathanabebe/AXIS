import { HexColorInput, HexColorPicker } from 'react-colorful'

import { normalizeHex } from '../colorValue'
import Button from './Button'
import { getChoiceKey, getSwatchColor } from './colorPresets'

import type { CSSProperties } from 'react'
import type { ColorValue } from '../colorValue'
import type { ColorPreset } from './colorPresets'

// ===== TYPES =================================================================
type ColorPickerProps<TPreset extends string = never> = {
  label: string
  presets: ColorPreset<TPreset>[]
  value: ColorValue | NoInfer<TPreset>
  onChange: (value: ColorValue | NoInfer<TPreset>) => void
}

// ===== CONSTANTS =============================================================
/** Color the area starts from while the value is a theme color or preset. */
const DEFAULT_PICKER_COLOR = '#8B5CF6'

// ===== COMPONENT =============================================================
/**
 * Picker of one color: the swatches of the presets of its place, then the
 * color area with the hue slider and the hex value. A swatch opens it in
 * a popover, the editor of a solid paint shows it in place. While the
 * value is a theme color or preset, the area starts from a custom color.
 * @param props Name, swatches, color and its handler.
 */
function ColorPicker<TPreset extends string = never>({
  label,
  presets,
  value,
  onChange,
}: ColorPickerProps<TPreset>) {
  const valueKey = getChoiceKey(value)
  const pickerColor =
    typeof value !== 'string' && value.kind === 'custom'
      ? normalizeHex(value.color)
      : DEFAULT_PICKER_COLOR

  /**
   * Selects a color from the area or the hex field.
   * @param hex Hex color, with or without `#`.
   */
  function selectCustomColor(hex: string): void {
    onChange({ kind: 'custom', color: normalizeHex(hex) })
  }

  return (
    <div className="color-picker stack">
      {presets.length > 0 ? (
        <div
          className="color-picker-presets"
          role="radiogroup"
          aria-label={`${label} presets`}
        >
          {presets.map((preset) => {
            const presetKey = getChoiceKey(preset.value)
            return (
              <Button
                key={presetKey}
                className={`color-swatch-swatch ${preset.fill ? 'has-fill' : ''}`}
                type="button"
                role="radio"
                aria-label={preset.label}
                aria-checked={presetKey === valueKey}
                title={preset.label}
                style={
                  {
                    '--swatch-color': getSwatchColor(preset.value),
                    '--swatch-fill': preset.fill,
                  } as CSSProperties
                }
                onClick={() => onChange(preset.value)}
              />
            )
          })}
        </div>
      ) : null}
      <HexColorPicker color={pickerColor} onChange={selectCustomColor} />
      <label className="color-picker-hex-field">
        <span>HEX</span>
        <HexColorInput
          className="color-picker-hex-input"
          color={pickerColor}
          prefixed
          aria-label={`${label} hex value`}
          onChange={selectCustomColor}
        />
      </label>
    </div>
  )
}

export default ColorPicker
