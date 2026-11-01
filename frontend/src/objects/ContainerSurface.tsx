import { getFillsCss } from '../shared/fill'
import ContainerBorder from './ContainerBorder'
import { getSurfaceEffects } from './containerSurfaceStyle'

import type { ReactNode } from 'react'
import type { ContainerSurfaceValue } from './containerSurfaceStyle'

// ===== TYPES =================================================================
type ContainerSurfaceProps = {
  children?: ReactNode
  surface: ContainerSurfaceValue
}

// ===== COMPONENT =============================================================
/**
 * Layers of a container around its content, from the bottom: background
 * blur, fills, noise and inner shadow under the content, the border above
 * it. The element around sets `getContainerSurfaceStyle`; the drop shadow
 * is its own box-shadow. The blur layer mounts anew when the fills change,
 * e.g. on a new style, since Chromium would keep blurring the old canvas
 * until the next repaint.
 * @param props Surface and the content between its layers.
 */
function ContainerSurface({ children, surface }: ContainerSurfaceProps) {
  const { backgroundBlur, innerShadows, noise } = getSurfaceEffects(
    surface.effects,
  )
  return (
    <>
      {backgroundBlur ? (
        <span
          aria-hidden="true"
          className="chart-item-backdrop"
          key={getFillsCss(surface.background)}
        />
      ) : null}
      <span aria-hidden="true" className="chart-item-background" />
      {noise ? <span aria-hidden="true" className="chart-item-noise" /> : null}
      {innerShadows.length > 0 ? (
        <span aria-hidden="true" className="chart-item-inner-shadow" />
      ) : null}
      {children}
      {surface.border.width > 0 ? (
        <ContainerBorder
          radius={surface.borderRadius}
          stroke={surface.border}
        />
      ) : null}
    </>
  )
}

export default ContainerSurface
