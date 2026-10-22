import Button from './Button'
import { getColorCss, getColorValueKey } from '../colorValue'

import type { ColorValue } from '../colorValue'

export type PaletteOption = {
  label: string
  colors: readonly ColorValue[]
}

type PaletteControlProps = {
  label: string
  palettes: PaletteOption[]
  value: ColorValue[]
  onChange: (colors: ColorValue[]) => void
}

/**
 * Tells whether the current palette equals a preset palette.
 * @param currentColors Palette of the spec.
 * @param paletteColors Colors of one preset palette.
 * @returns True when both list the same colors in the same order.
 */
function palettesMatch(
  currentColors: ColorValue[],
  paletteColors: readonly ColorValue[],
): boolean {
  return (
    currentColors.length === paletteColors.length &&
    currentColors.every((color, index) => {
      return getColorValueKey(color) === getColorValueKey(paletteColors[index])
    })
  )
}

function PaletteControl({
  label,
  palettes,
  value,
  onChange,
}: PaletteControlProps) {
  return (
    <div className="palette-control" role="radiogroup" aria-label={label}>
      {palettes.map((palette) => {
        const isActive = palettesMatch(value, palette.colors)

        return (
          <Button
            className="palette-control-option"
            role="radio"
            aria-label={palette.label}
            aria-checked={isActive}
            title={palette.label}
            isActive={isActive}
            onClick={() => {
              onChange([...palette.colors])
            }}
            key={palette.label}
          >
            <span className="palette-control-preview" aria-hidden="true">
              {palette.colors.map((color, index) => (
                <span
                  className="palette-control-swatch"
                  style={{ backgroundColor: getColorCss(color) }}
                  key={`${getColorValueKey(color)}-${index}`}
                />
              ))}
            </span>
          </Button>
        )
      })}
    </div>
  )
}

export default PaletteControl
