import type { CSSProperties } from 'react'

import type { ElementRect } from './types'

/**
 * Measures an HTML element inside the frame of its object, like the rects
 * that canvases such as ECharts report.
 * @param target Element under the pointer, e.g. a title.
 * @returns Its bounds in frame coordinates, or null outside of a frame.
 */
export function getRectInFrame(target: Element): ElementRect | null {
  const frame = target.closest<HTMLElement>('[data-object-id]')
  if (!frame) {
    return null
  }
  const targetRect = target.getBoundingClientRect()
  const frameRect = frame.getBoundingClientRect()
  return {
    height: targetRect.height,
    width: targetRect.width,
    x: targetRect.x - frameRect.x - frame.clientLeft,
    y: targetRect.y - frameRect.y - frame.clientTop,
  }
}

/** Positions an overlay exactly over a rect. */
export function getRectStyle({
  height,
  width,
  x,
  y,
}: ElementRect): CSSProperties {
  return {
    height,
    left: x,
    top: y,
    width,
  }
}
