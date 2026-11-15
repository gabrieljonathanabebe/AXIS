import { getRectInFrame } from '../objects/elementRect'
import { getColorCss } from '../shared/colorValue'
import { formatCompactNumber } from '../shared/format/formatNumber'
import { getSideOrientation } from '../shared/layout'

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
  onHover: ShowFormatHint
}

// ===== COMPONENT =============================================================
/**
 * Continuous color scale of a chart, as HTML in its place next to the
 * canvas: a gradient bar between its minimum and maximum. At the left or
 * right it stands upright with the maximum on top, at the top or bottom
 * it lies with the minimum on the left. It centers on the plot, not on
 * the whole canvas, and is a format region of its own.
 * @param props Room around the plot, range and appearance of the scale,
 *   and the format hint on hover.
 */
function ChartColorScale({
  plotInsets,
  range,
  scale,
  onHover,
}: ChartColorScaleProps) {
  const { position } = scale.layout
  const isVertical = getSideOrientation(position) === 'vertical'
  const [first, last] = isVertical
    ? [range.max, range.min]
    : [range.min, range.max]
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

  /** Shows the scale as format hint. */
  function showHint(target: HTMLElement): void {
    const rect = getRectInFrame(target)
    if (rect) {
      onHover({ element: 'colorScale', rect })
    }
  }

  return (
    <div
      className={`chart-color-scale ${isVertical ? 'is-vertical' : ''}`}
      style={placeStyle}
    >
      <div
        className="chart-color-scale-body"
        data-format-element="colorScale"
        onPointerEnter={(event) => showHint(event.currentTarget)}
        onPointerLeave={() => onHover(null)}
      >
        {scale.labels ? (
          <span className="chart-color-scale-label">
            {formatCompactNumber(first)}
          </span>
        ) : null}
        <span className="chart-color-scale-bar" style={barStyle} />
        {scale.labels ? (
          <span className="chart-color-scale-label">
            {formatCompactNumber(last)}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default ChartColorScale
