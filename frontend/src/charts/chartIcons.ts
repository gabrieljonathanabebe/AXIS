import { createLucideIcon } from 'lucide-react'

import type { IconNode } from 'lucide-react'

// ===== TYPES =================================================================
/** One SVG element of an icon, e.g. the bar of a bar chart. */
type IconElement = IconNode[number]

// ===== GLYPHS ================================================================
/**
 * Upright bar, the mark of a bar chart. It ends at the bottom of the 16 px
 * area every icon fills, so all icons of a group look equally large.
 * @param top Top edge from the top, lower when a label sits above.
 * @returns The rectangle of the bar.
 */
function barGlyph(top: number): IconElement {
  return [
    'rect',
    {
      height: `${20 - top}`,
      key: 'mark',
      rx: '1',
      width: '10',
      x: '7',
      y: `${top}`,
    },
  ]
}

/** Pie segment, the mark of a pie or donut chart. */
const sliceGlyph: IconElement = [
  'path',
  { d: 'M6 18V6a12 12 0 0 1 12 12Z', key: 'mark' },
]

/**
 * Point of a line or scatter chart.
 * @param x Center from the left.
 * @param y Center from the top.
 * @param radius Radius, larger for a point that holds its label.
 * @returns The circle of the point.
 */
function pointGlyph(x: number, y: number, radius = 4): IconElement {
  return ['circle', { cx: `${x}`, cy: `${y}`, key: 'mark', r: `${radius}` }]
}

/**
 * Short line that stands for the text of a label.
 * @param x Center from the left.
 * @param y Center from the top.
 * @param width Length, shorter inside a mark.
 * @returns The line of the label.
 */
function labelGlyph(x: number, y: number, width = 6): IconElement {
  return [
    'line',
    {
      key: 'label',
      x1: `${x - width / 2}`,
      x2: `${x + width / 2}`,
      y1: `${y}`,
      y2: `${y}`,
    },
  ]
}

/** Letter x, the variable that the mean and median icons mark. */
const variableGlyph: IconElement = [
  'path',
  { d: 'M7 10l10 10M17 10 7 20', key: 'variable' },
]

// ===== ICONS =================================================================
export const BarLabelInside = createLucideIcon('bar-label-inside', [
  barGlyph(4),
  labelGlyph(12, 12, 4),
])

export const BarLabelTop = createLucideIcon('bar-label-top', [
  barGlyph(9),
  labelGlyph(12, 5),
])

export const PointLabelInside = createLucideIcon('point-label-inside', [
  pointGlyph(12, 12, 7),
  labelGlyph(12, 12, 4),
])

export const PointLabelRight = createLucideIcon('point-label-right', [
  pointGlyph(7, 12),
  labelGlyph(17, 12),
])

export const PointLabelTop = createLucideIcon('point-label-top', [
  pointGlyph(12, 15),
  labelGlyph(12, 6),
])

export const SliceLabelInside = createLucideIcon('slice-label-inside', [
  sliceGlyph,
  labelGlyph(11, 14, 4),
])

export const SliceLabelOutside = createLucideIcon('slice-label-outside', [
  sliceGlyph,
  labelGlyph(18, 5),
])

/** x̄, the symbol of the mean. */
export const XBar = createLucideIcon('x-bar', [
  variableGlyph,
  ['path', { d: 'M7 5h10', key: 'bar' }],
])

/** x̃, the symbol of the median. */
export const XTilde = createLucideIcon('x-tilde', [
  variableGlyph,
  ['path', { d: 'M7 6c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0', key: 'tilde' }],
])
