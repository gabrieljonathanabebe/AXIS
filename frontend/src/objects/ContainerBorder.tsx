import { useId } from 'react'

import { getColorCss } from '../shared/colorValue'
import { getLinearGradientPoints, getSortedStops } from '../shared/paint'

import type { CSSProperties, ReactNode } from 'react'
import type { Paint } from '../shared/paint'
import type { StrokeStyle } from '../shared/strokeStyle'

// ===== TYPES =================================================================
type ContainerBorderProps = {
  radius: number
  stroke: StrokeStyle
}

type ContainerBorderStyle = CSSProperties & {
  '--chart-border-inset': string
}

// ===== HELPERS ===============================================================
/**
 * Dash pattern of a line style, the same ECharts draws for marks and axes.
 * @param stroke Stroke style of the border.
 * @returns Dash and gap lengths, or none for a solid line.
 */
function getDashArray({ lineStyle, width }: StrokeStyle): string | undefined {
  if (lineStyle === 'dashed') {
    return `${4 * width} ${2 * width}`
  }
  return lineStyle === 'dotted' ? `${width}` : undefined
}

/**
 * SVG gradient the border paints with, inside the bounds of the shape; a
 * radial one is an ellipse around its center like in CSS.
 * @param id Id the rect refers to.
 * @param paint Paint of the border.
 * @returns Linear or radial gradient, or nothing for a solid color.
 */
function getGradientElement(id: string, paint: Paint): ReactNode {
  if (paint.kind === 'solid') {
    return null
  }
  const stops = getSortedStops(paint.stops).map((stop, index) => (
    <stop
      key={index}
      offset={stop.position}
      style={{ stopColor: getColorCss(stop.color), stopOpacity: stop.opacity }}
    />
  ))
  if (paint.type === 'radial') {
    return (
      <radialGradient
        cx={paint.centerX}
        cy={paint.centerY}
        id={id}
        r={paint.radius}
      >
        {stops}
      </radialGradient>
    )
  }
  const { x, x2, y, y2 } = getLinearGradientPoints(paint.angle)
  return (
    <linearGradient id={id} x1={x} x2={x2} y1={y} y2={y2}>
      {stops}
    </linearGradient>
  )
}

// ===== COMPONENT =============================================================
/**
 * Border of a container as SVG, so a gradient, a dash pattern and the
 * corner radius work together, which a CSS border cannot. The rect sits
 * half a stroke inside the frame, so the stroke ends at its edge.
 * @param props Stroke style of the border and corner radius of the frame.
 */
function ContainerBorder({ radius, stroke }: ContainerBorderProps) {
  const gradientId = useId()
  const { paint, width } = stroke
  const style: ContainerBorderStyle = {
    '--chart-border-inset': `${width / 2}px`,
    opacity: stroke.opacity,
  }
  return (
    <svg aria-hidden="true" className="chart-item-border" style={style}>
      <defs>{getGradientElement(gradientId, paint)}</defs>
      <rect
        fill="none"
        height="100%"
        rx={Math.max(radius - width / 2, 0)}
        strokeDasharray={getDashArray(stroke)}
        strokeWidth={width}
        style={{
          stroke:
            paint.kind === 'solid'
              ? getColorCss(paint.color)
              : `url(#${gradientId})`,
        }}
        width="100%"
      />
    </svg>
  )
}

export default ContainerBorder
