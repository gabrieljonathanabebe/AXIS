import { HexColorInput } from 'react-colorful'

import { getColorValueKey, normalizeHex } from '../colorValue'
import ColorControl from './ColorControl'

import type { ColorValue } from '../colorValue'
import type { ColorPreset } from './ColorControl'

// ===== TYPES =================================================================
type ColorFieldProps<TPreset extends string = never> = {
  label: string
  presets: ColorPreset<TPreset>[]
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
 * Field of one color: swatch with the color picker, then the hex value of
 * an own color or the swatch name of a theme color or named preset, e.g.
 * the glass background of a container.
 * @param props Name of the paint, swatches, color and its handler.
 */
function ColorField<TPreset extends string = never>({
  label,
  presets,
  value,
  onChange,
}: ColorFieldProps<TPreset>) {
  return (
    <div className="field color-field">
      <ColorControl
        label={`${label} color`}
        presets={presets}
        value={value}
        variant="compact"
        onChange={onChange}
      />
      {typeof value !== 'string' && value.kind === 'custom' ? (
        <HexColorInput
          className="color-field-hex"
          color={value.color}
          aria-label={`${label} hex value`}
          onChange={(hex) => {
            onChange({ kind: 'custom', color: normalizeHex(hex) })
          }}
        />
      ) : (
        <span className="color-field-name">
          {getSwatchLabel(value, presets)}
        </span>
      )}
    </div>
  )
}

export default ColorField
