import { getShadowsCss } from '../shared/effect'
import { getFillsCss } from '../shared/fill'

import type { CSSProperties } from 'react'
import type { ContainerEffect } from '../shared/effect'
import type { ObjectContainer } from './types'

// ===== TYPES =================================================================
/** What a container surface draws: fills, border, radius and effects. */
export type ContainerSurfaceValue = Pick<
  ObjectContainer,
  'background' | 'border' | 'borderRadius' | 'effects'
>

/** CSS variables of a surface, read by its element and its layers. */
export type ContainerSurfaceStyle = CSSProperties & {
  '--chart-backdrop-blur': string
  '--chart-background': string
  '--chart-inner-shadow': string
  '--chart-noise-opacity': number
  '--chart-noise-size': string
  '--chart-radius': string
  '--chart-shadow': string
}

// ===== FUNCTIONS =============================================================
/**
 * Sorts the effects of a surface by the layer they are drawn on.
 * @param effects Effects of a container.
 * @returns Drop shadows, inner shadows, background blur and noise.
 */
export function getSurfaceEffects(effects: ContainerEffect[]) {
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
export function getContainerSurfaceStyle(
  surface: ContainerSurfaceValue,
): ContainerSurfaceStyle {
  const { backgroundBlur, innerShadows, noise, shadows } = getSurfaceEffects(
    surface.effects,
  )
  return {
    '--chart-backdrop-blur': `${backgroundBlur?.blur ?? 0}px`,
    '--chart-background': getFillsCss(surface.background),
    '--chart-inner-shadow': getShadowsCss(innerShadows, true),
    '--chart-noise-opacity': noise?.opacity ?? 0,
    '--chart-noise-size': `${noise?.size ?? 0}px`,
    '--chart-radius': `${surface.borderRadius}px`,
    '--chart-shadow': getShadowsCss(shadows),
  }
}
