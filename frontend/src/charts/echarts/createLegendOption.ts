import type { LegendComponentOption } from 'echarts'

// ===== FUNCTION ==============================================================
/**
 * Creates the hidden ECharts legend. The chart shows its legend as HTML;
 * ECharts only leaves out the series or pie segments switched off there.
 * @param hiddenNames Names of the entries switched off.
 * @returns Hidden legend that filters the marks.
 */
export function createLegendOption(
  hiddenNames: ReadonlySet<string>,
): LegendComponentOption {
  return {
    selected: Object.fromEntries([...hiddenNames].map((name) => [name, false])),
    show: false,
  }
}
