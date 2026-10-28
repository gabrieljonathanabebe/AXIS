import type { ColorToken } from '../../shared/colorValue'

/**
 * Colors and sizes a chart reads from the CSS tokens at its element.
 * `accent` is the dashboard accent of the brush, `formatFocus` the app
 * accent that marks the element in the format popover.
 */
export type ChartTheme = {
  accent: string
  axis: string
  colors: Record<ColorToken, string>
  formatFocus: string
  text: string
  textMuted: string
  tooltip: {
    background: string
    borderColor: string
    borderWidth: number
    fontSize: number
    blur: string
    radius: string
    shadow: string
  }
}
