import { getRectInFrame } from '../objects/elementRect'
import { getColorCss } from '../shared/colorValue'
import { createNumberFormatter } from '../shared/format/formatNumber'
import { getSideOrientation } from '../shared/layout'
import { getPaintColor } from '../shared/paint'
import { getTextStyleCss } from '../shared/textStyle'
import { getColorScaleTicks } from './getColorScaleTicks'

import type { CSSProperties } from 'react'
import type { ShowFormatHint } from '../objects/ObjectFrame'
import type { Side } from '../shared/layout'
import type { NumericDomain } from './getNumericDomain'
import type { ColorScaleAppearance } from './types'

// ===== TYPES =================================================================
type ChartColorScaleProps = {
  plotInsets: Record<Side, number>
  range: NumericDomain
  scale: ColorScaleAppearance['continuous']
  title: string
  onHover: ShowFormatHint
}

/** Text, mark color and mark width the ticks of the scale share. */
type TicksStyle = CSSProperties & {
  '--color-scale-tick-color': string
  '--color-scale-tick-width': string
}

/** Place of one tick along the bar, from the minimum at 0 %. */
type TickStyle = CSSProperties & {
  '--color-scale-tick-position': string
}

// ===== HELPERS ===============================================================
/**
 * Classes of a tick; one at an end of the bar aligns inward, so its value
 * stays within the length of the bar, e.g. the minimum on the left.
 * @param share Place of the tick, from 0 at the minimum to 1 at the maximum.
 * @returns The tick class, with `is-start` or `is-end` at an end.
 */
function getTickClassName(share: number): string {
  if (share === 0) {
    return 'chart-color-scale-tick is-start'
  }
  if (share === 1) {
    return 'chart-color-scale-tick is-end'
  }
  return 'chart-color-scale-tick'
}

// ===== COMPONENT =============================================================
/**
 * Continuous color scale of a chart, as HTML in its place next to the
 * canvas: its title above a gradient bar, its values on the side away
 * from the plot like at an axis. At the left or right the bar stands
 * upright with the maximum on top, at the top or bottom it lies with the
 * minimum on the left. It centers on the plot and is a format region.
 * @param props Room around the plot, range, appearance and title of the
 *   scale, and the format hint on hover.
 */
function ChartColorScale({
  plotInsets,
  range,
  scale,
  title,
  onHover,
}: ChartColorScaleProps) {
  const { position } = scale.layout
  const isVertical = getSideOrientation(position) === 'vertical'
  const ticks = getColorScaleTicks(range, scale.labels.tickCount)
  const formatValue = createNumberFormatter(scale.labels.numberFormat)
  const span = range.max - range.min
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
  const barStyle: CSSProperties = {
    background: `linear-gradient(${isVertical ? 'to top' : 'to right'}, ${getColorCss(
      scale.startColor,
    )}, ${getColorCss(scale.endColor)})`,
  }
  const { stroke } = scale.ticks
  const ticksStyle: TicksStyle = {
    ...getTextStyleCss(scale.labels.textStyle),
    '--color-scale-tick-color': scale.ticks.visible
      ? getColorCss(getPaintColor(stroke.paint), stroke.opacity)
      : 'transparent',
    '--color-scale-tick-width': `${stroke.width}px`,
  }

  /** Shows the scale as format hint. */
  function showHint(target: HTMLElement): void {
    const rect = getRectInFrame(target)
    if (rect) {
      onHover({ element: 'colorScale', rect })
    }
  }

  /** Share of the bar up to a value, from 0 at the minimum to 1. */
  function getTickShare(value: number): number {
    return span > 0 ? (value - range.min) / span : 0.5
  }

  return (
    <div
      className={`chart-color-scale is-${position} ${
        isVertical ? 'is-vertical' : ''
      }`}
      style={placeStyle}
    >
      <div
        className="chart-color-scale-body"
        data-format-element="colorScale"
        onPointerEnter={(event) => showHint(event.currentTarget)}
        onPointerLeave={() => onHover(null)}
      >
        {scale.title.visible && title ? (
          <span
            className="chart-color-scale-title"
            style={getTextStyleCss(scale.title.textStyle)}
          >
            {title}
          </span>
        ) : null}
        <div className="chart-color-scale-axis">
          <span className="chart-color-scale-bar" style={barStyle} />
          {scale.labels.visible || scale.ticks.visible ? (
            <div className="chart-color-scale-ticks" style={ticksStyle}>
              {ticks.map((value) => {
                const share = getTickShare(value)
                const tickStyle: TickStyle = {
                  '--color-scale-tick-position': `${share * 100}%`,
                }
                return (
                  <span
                    className={getTickClassName(share)}
                    key={value}
                    style={tickStyle}
                  >
                    <span className="chart-color-scale-tick-mark" />
                    {scale.labels.visible ? (
                      <span className="chart-color-scale-label">
                        {formatValue(value)}
                      </span>
                    ) : null}
                  </span>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ChartColorScale
