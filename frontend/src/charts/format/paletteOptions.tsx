import { getColorCss, getColorValueKey } from '@/shared/colorValue'

import type { ReactNode } from 'react'
import type { CategoricalColorPalette } from '@/charts/colorPalettes'
import type { ColorValue } from '@/shared/colorValue'
import type { OptionItem } from '@/shared/optionItem'

// ===== FUNCTIONS =============================================================
/**
 * Palette with this name, e.g. "Vivid".
 * @param name Name of the palette, also the value of its option.
 * @param palettes Palettes to search.
 * @returns The palette, if one has this name.
 */
function findPalette(
  name: string,
  palettes: CategoricalColorPalette[],
): CategoricalColorPalette | undefined {
  return palettes.find((palette) => palette.label === name)
}

/**
 * Tells whether two lists name the same colors in the same order.
 * @param colors Colors of the chart.
 * @param paletteColors Colors of one palette.
 * @returns True when both list the same colors in the same order.
 */
function hasSameColors(
  colors: ColorValue[],
  paletteColors: ColorValue[],
): boolean {
  return (
    colors.length === paletteColors.length &&
    colors.every((color, index) => {
      return getColorValueKey(color) === getColorValueKey(paletteColors[index])
    })
  )
}

/**
 * Palettes as options of a select; the name is label and value.
 * @param palettes Palettes to offer, e.g. Style and the presets.
 * @returns One option per palette.
 */
export function getPaletteOptions(
  palettes: CategoricalColorPalette[],
): OptionItem<string>[] {
  return palettes.map(({ label }) => ({ label, value: label }))
}

/**
 * Name of the palette with exactly these colors; colors that match none,
 * e.g. after one color was changed, give an empty name, shown as "Custom".
 * @param colors Colors of the chart.
 * @param palettes Palettes to compare with.
 * @returns Name of the matching palette, or an empty string.
 */
export function toPaletteName(
  colors: ColorValue[],
  palettes: CategoricalColorPalette[],
): string {
  const palette = palettes.find((candidate) => {
    return hasSameColors(colors, candidate.colors)
  })
  return palette?.label ?? ''
}

/**
 * Colors of a palette as a copy, so the chart never shares the list of a
 * preset, e.g. "Vivid" → its five colors.
 * @param name Name of the chosen palette.
 * @param palettes Palettes to search.
 * @returns Copy of its colors, if one has this name.
 */
export function toPaletteColors(
  name: string,
  palettes: CategoricalColorPalette[],
): ColorValue[] | undefined {
  const palette = findPalette(name, palettes)
  return palette ? [...palette.colors] : undefined
}

/**
 * Shows the palette of an option as a strip of its colors next to its
 * name; the button of the select shows the strip alone.
 * @param option Option of the menu or the selected one.
 * @param palettes Palettes behind the options.
 * @returns Strip and name, or the label when no palette has this name.
 */
export function renderPaletteOption(
  option: OptionItem<string>,
  palettes: CategoricalColorPalette[],
): ReactNode {
  const palette = findPalette(option.value, palettes)
  if (!palette) {
    return option.label
  }
  return (
    <span className="palette-option">
      <span className="palette-option-strip" aria-hidden="true">
        {palette.colors.map((color, index) => (
          <span
            className="palette-option-swatch"
            style={{ backgroundColor: getColorCss(color) }}
            key={`${getColorValueKey(color)}-${index}`}
          />
        ))}
      </span>
      <span className="palette-option-name">{palette.label}</span>
    </span>
  )
}
