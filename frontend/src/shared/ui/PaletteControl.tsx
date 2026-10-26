import { getColorCss, getColorValueKey } from '../colorValue'
import SelectControl from './SelectControl'

import type { ReactNode } from 'react'
import type { ColorValue } from '../colorValue'
import type { OptionItem } from './OptionsMenu'

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

/**
 * Shows one palette as a strip of its colors next to its name.
 * @param palette Palette to show.
 * @returns Strip and name.
 */
function renderPalette(palette: PaletteOption): ReactNode {
  return (
    <span className="palette-control-option">
      <span className="palette-control-preview" aria-hidden="true">
        {palette.colors.map((color, index) => (
          <span
            className="palette-control-swatch"
            style={{ backgroundColor: getColorCss(color) }}
            key={`${getColorValueKey(color)}-${index}`}
          />
        ))}
      </span>
      <span className="palette-control-name">{palette.label}</span>
    </span>
  )
}

/**
 * Picks the palette of categorical colors from a menu. Button and menu
 * show each palette as a strip of its colors; colors that match no
 * palette show as "Custom".
 * @param props Palettes, current colors and their handler.
 */
function PaletteControl({
  label,
  palettes,
  value,
  onChange,
}: PaletteControlProps) {
  const options = palettes.map((palette) => ({
    label: palette.label,
    value: palette.label,
  }))
  const selectedPalette = palettes.find((palette) => {
    return palettesMatch(value, palette.colors)
  })

  /**
   * Finds a palette by its name, which is also the value of its option.
   * @param name Name of the palette.
   * @returns The palette, if one has this name.
   */
  function findPalette(name: string): PaletteOption | undefined {
    return palettes.find((palette) => palette.label === name)
  }

  /**
   * Shows the palette behind an option as strip and name.
   * @param option Option of the menu or the selected one.
   * @returns Strip and name of the palette.
   */
  function renderOption(option: OptionItem<string>): ReactNode {
    const palette = findPalette(option.value)
    return palette ? renderPalette(palette) : option.label
  }

  /**
   * Applies the colors of the chosen palette.
   * @param name Name of the chosen palette.
   */
  function selectPalette(name: string): void {
    const palette = findPalette(name)
    if (palette) {
      onChange([...palette.colors])
    }
  }

  return (
    <SelectControl
      label={label}
      options={options}
      placeholder="Custom"
      renderOption={renderOption}
      value={selectedPalette?.label ?? ''}
      onChange={selectPalette}
    />
  )
}

export default PaletteControl
