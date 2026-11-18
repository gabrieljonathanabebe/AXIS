import { getRectInFrame } from '../objects/elementRect'
import { getColorCss } from '../shared/colorValue'
import { getSideOrientation } from '../shared/layout'
import { getSurfaceStyle } from '../shared/surface'
import { getTextStyleCss } from '../shared/textStyle'
import SurfaceLayers from '../shared/ui/SurfaceLayers'

import type { CSSProperties, ReactNode } from 'react'
import type { ShowFormatHint } from '../objects/ObjectFrame'
import type { HorizontalAlignment, Side } from '../shared/layout'
import type { ChartInstance, LegendEntry } from './types'

// ===== TYPES =================================================================
/** Shape in front of an entry, e.g. the rectangle of a bar. */
type LegendSymbol = 'circle' | 'diamond' | 'line' | 'rect' | 'triangle'

type ChartLegendProps = {
  chart: ChartInstance
  entries: LegendEntry[]
  hiddenNames: ReadonlySet<string>
  plotInsets: Record<Side, number>
  onEmphasize: (name: string, isActive: boolean) => void
  onHover: ShowFormatHint
  onToggle: (name: string) => void
}

// ===== CONSTANTS =============================================================
/** Symbols as wide as the item width; the others are square. */
const WIDE_SYMBOLS: ReadonlySet<LegendSymbol> = new Set(['line', 'rect'])

/** Thickness of the line symbol in pixels. */
const LINE_THICKNESS = 3

/** Where a row of entries starts along the top or bottom side. */
const ROW_ALIGNMENTS = {
  center: 'center',
  end: 'flex-end',
  start: 'flex-start',
} satisfies Record<HorizontalAlignment, string>

// ===== HELPERS ===============================================================
/**
 * Shape of the entries: the chosen one, or with `auto` the shape of the
 * marks, e.g. a line for a line chart or the symbol of a scatter.
 * @param chart Chart with its type and appearance.
 * @returns Shape the entries show.
 */
function getLegendSymbol(chart: ChartInstance): LegendSymbol {
  const { legend, scatter } = chart.spec.appearance
  if (legend.symbol !== 'auto') {
    return legend.symbol
  }
  if (chart.type === 'line') {
    return 'line'
  }
  return chart.type === 'scatter' ? scatter.symbol : 'rect'
}

// ===== COMPONENT =============================================================
/**
 * Legend of a chart, as HTML in its place next to the canvas. At the top
 * or bottom the entries form a row that sits by its alignment along the
 * plot; at the left or right a column, centered on the plot. Too many
 * entries wrap with `plain` and scroll otherwise, inside the surface of
 * the legend. While the legend is interactive, a click on an entry hides
 * or shows its marks. The legend is a format region of its own.
 * @param props Chart, entries and the hidden ones, room around the plot,
 *   and callbacks for emphasis, format hint and toggling.
 */
function ChartLegend({
  chart,
  entries,
  hiddenNames,
  plotInsets,
  onEmphasize,
  onHover,
  onToggle,
}: ChartLegendProps) {
  const { legend } = chart.spec.appearance
  const isInteractive = chart.spec.interaction.legend.enabled
  const { alignment, gap, position } = legend.layout
  const isVertical = getSideOrientation(position) === 'vertical'
  const symbol = getLegendSymbol(chart)
  const placeStyle: CSSProperties = isVertical
    ? {
        gridArea: position,
        paddingBottom: plotInsets.bottom,
        paddingTop: plotInsets.top,
      }
    : {
        gridArea: position,
        paddingLeft: plotInsets.left,
        paddingRight: plotInsets.right,
      }
  const bodyStyle: CSSProperties = {
    ...getSurfaceStyle(legend.surface),
    ...getTextStyleCss(legend.textStyle),
    justifySelf: isVertical ? undefined : alignment,
    padding: legend.layout.padding,
  }
  const entriesStyle: CSSProperties = {
    gap,
    justifyContent: isVertical ? undefined : ROW_ALIGNMENTS[alignment],
  }
  const symbolSize: CSSProperties = {
    height: symbol === 'line' ? LINE_THICKNESS : legend.itemHeight,
    width: WIDE_SYMBOLS.has(symbol) ? legend.itemWidth : legend.itemHeight,
  }

  /**
   * Shows the legend as format hint; while its entries toggle, a plain
   * click acts on the data and only Cmd/Ctrl+click formats.
   */
  function showHint(target: HTMLElement): void {
    const rect = getRectInFrame(target)
    if (rect) {
      onHover({ element: 'legend', hasDataAction: isInteractive, rect })
    }
  }

  /**
   * One entry: its symbol and name, in the inactive color while hidden.
   * While the legend is interactive it is a button that hides or shows
   * its marks.
   * @param entry Name and color of the entry.
   * @returns The entry.
   */
  function renderEntry(entry: LegendEntry): ReactNode {
    const isHidden = hiddenNames.has(entry.name)
    const color = isHidden ? getColorCss(legend.inactiveColor) : entry.color
    const content = (
      <>
        <span
          className={`chart-legend-symbol is-${symbol}`}
          style={{ ...symbolSize, backgroundColor: color }}
        />
        <span className="chart-legend-text">{entry.label ?? entry.name}</span>
      </>
    )
    if (!isInteractive) {
      return (
        <span
          className="chart-legend-entry"
          key={entry.name}
          title={entry.label ?? entry.name}
          onPointerEnter={() => onEmphasize(entry.name, true)}
          onPointerLeave={() => onEmphasize(entry.name, false)}
        >
          {content}
        </span>
      )
    }
    return (
      <button
        aria-pressed={!isHidden}
        className="chart-legend-entry"
        key={entry.name}
        style={isHidden ? { color } : undefined}
        title={entry.label ?? entry.name}
        type="button"
        onClick={() => onToggle(entry.name)}
        onPointerEnter={() => onEmphasize(entry.name, true)}
        onPointerLeave={() => onEmphasize(entry.name, false)}
      >
        {content}
      </button>
    )
  }

  return (
    <div
      className={`chart-legend ${isVertical ? 'is-vertical' : ''}`}
      style={placeStyle}
    >
      <div
        className="chart-legend-body surface"
        data-format-element="legend"
        style={bodyStyle}
        onPointerEnter={(event) => showHint(event.currentTarget)}
        onPointerLeave={() => onHover(null)}
      >
        <SurfaceLayers surface={legend.surface} />
        <div
          className={`chart-legend-entries ${
            legend.overflow === 'plain' ? 'is-wrapping' : 'is-scrolling'
          }`}
          style={entriesStyle}
        >
          {entries.map(renderEntry)}
        </div>
      </div>
    </div>
  )
}

export default ChartLegend
