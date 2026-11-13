import { getShadowsCss } from './effect'
import { getFillsCss } from './fill'

import type { CSSProperties } from 'react'
import type { SurfaceEffect } from './effect'
import type { Fill } from './fill'
import type { StrokeStyle } from './strokeStyle'

// ===== TYPES =================================================================
/**
 * Fill, border, corner radius and effects of a box, e.g. the container of
 * an object; layout and content belong to the box itself.
 */
export type Surface = {
  background: Fill[]
  border: StrokeStyle
  borderRadius: number
  effects: SurfaceEffect[]
}

/**
 * What draws a surface: HTML layers (`SurfaceLayers`) or CSS on one element
 * that ECharts renders, e.g. the tooltip.
 */
export type SurfaceRenderer = 'css' | 'html'

/** What a renderer can draw beyond fills, a plain border and the radius. */
type SurfaceCapabilities = {
  borderGradient: boolean
  effects: SurfaceEffect['kind'][]
}

/** CSS variables of a surface, read by its element and its layers. */
export type SurfaceStyle = CSSProperties & {
  '--surface-backdrop-blur': string
  '--surface-background': string
  '--surface-inner-shadow': string
  '--surface-noise-opacity': number
  '--surface-noise-size': string
  '--surface-radius': string
  '--surface-shadow': string
}

// ===== CONSTANTS =============================================================
/**
 * What each renderer draws, the one place controls ask: CSS on an ECharts
 * element has no SVG border, so no gradient in it, and no grain layer.
 */
export const SURFACE_CAPABILITIES: Record<
  SurfaceRenderer,
  SurfaceCapabilities
> = {
  css: {
    borderGradient: false,
    effects: ['shadow', 'innerShadow', 'backgroundBlur'],
  },
  html: {
    borderGradient: true,
    effects: ['shadow', 'innerShadow', 'backgroundBlur', 'noise'],
  },
}

// ===== FUNCTIONS =============================================================
/**
 * Sorts the effects of a surface by the layer they are drawn on.
 * @param effects Effects of a container.
 * @returns Drop shadows, inner shadows, background blur and noise.
 */
export function getSurfaceEffects(effects: SurfaceEffect[]) {
  return {
    backgroundBlur: effects.find((effect) => effect.kind === 'backgroundBlur'),
    innerShadows: effects.filter((effect) => effect.kind === 'innerShadow'),
    noise: effects.find((effect) => effect.kind === 'noise'),
    shadows: effects.filter((effect) => effect.kind === 'shadow'),
  }
}

/**
 * CSS variables of a surface for the element that holds its layers, e.g.
 * the frame of an object or a container in a style preview.
 * @param surface Fills, border, radius and effects.
 * @returns Variables of fills, effects and corner radius.
 */
export function getSurfaceStyle(surface: Surface): SurfaceStyle {
  const { backgroundBlur, innerShadows, noise, shadows } = getSurfaceEffects(
    surface.effects,
  )
  return {
    '--surface-backdrop-blur': `${backgroundBlur?.blur ?? 0}px`,
    '--surface-background': getFillsCss(surface.background),
    '--surface-inner-shadow': getShadowsCss(innerShadows, true),
    '--surface-noise-opacity': noise?.opacity ?? 0,
    '--surface-noise-size': `${noise?.size ?? 0}px`,
    '--surface-radius': `${surface.borderRadius}px`,
    '--surface-shadow': getShadowsCss(shadows),
  }
}
