import { getFillsCss } from '../fill'
import { getSurfaceEffects } from '../surface'
import SurfaceBorder from './SurfaceBorder'

import type { ReactNode } from 'react'
import type { Surface } from '../surface'

// ===== TYPES =================================================================
type SurfaceLayersProps = {
  children?: ReactNode
  surface: Surface
}

// ===== COMPONENT =============================================================
/**
 * Layers of a container around its content, from the bottom: background
 * blur, fills, noise and inner shadow under the content, the border above
 * it. The element around sets `getSurfaceStyle`; the drop shadow
 * is its own box-shadow. The blur layer mounts anew when the fills change,
 * e.g. on a new style, since Chromium would keep blurring the old canvas
 * until the next repaint.
 * @param props Surface and the content between its layers.
 */
function SurfaceLayers({ children, surface }: SurfaceLayersProps) {
  const { backgroundBlur, innerShadows, noise } = getSurfaceEffects(
    surface.effects,
  )
  return (
    <>
      {backgroundBlur ? (
        <span
          aria-hidden="true"
          className="surface-backdrop"
          key={getFillsCss(surface.background)}
        />
      ) : null}
      <span aria-hidden="true" className="surface-background" />
      {noise ? <span aria-hidden="true" className="surface-noise" /> : null}
      {innerShadows.length > 0 ? (
        <span aria-hidden="true" className="surface-inner-shadow" />
      ) : null}
      {children}
      {surface.border.width > 0 ? (
        <SurfaceBorder radius={surface.borderRadius} stroke={surface.border} />
      ) : null}
    </>
  )
}

export default SurfaceLayers
