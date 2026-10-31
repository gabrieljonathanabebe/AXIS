import type { StyleRecipe } from './types'

/** Default style: neutral dark, solid containers on a graphite canvas. */
export const GRAPHITE: StyleRecipe = {
  accent: '#D0D5DD',
  canvas: {
    base: '#141518',
    glows: [],
  },
  material: 'solid',
  name: 'Graphite',
  scheme: 'dark',
  surface: '#202226',
}

/**
 * Dark and colorful: frosted navy containers over a navy canvas with a
 * large blue glow behind them and a second one from the bottom right.
 */
export const MIDNIGHT: StyleRecipe = {
  accent: '#3D7BFF',
  canvas: {
    base: '#0E1846',
    glows: [
      { centerX: 0.62, centerY: 0.55, color: '#2F62FF', radius: 0.7 },
      { centerX: 0.95, centerY: 1.05, color: '#2E7BFF', radius: 0.4 },
    ],
  },
  material: 'frosted',
  name: 'Midnight',
  scheme: 'dark',
  surface: '#060B28',
}

/**
 * Light and neutral: white solid containers with a fine border and a soft
 * shadow on a cool light grey canvas.
 */
export const DAYLIGHT: StyleRecipe = {
  accent: '#344054',
  canvas: {
    base: '#E4E8EE',
    glows: [],
  },
  material: 'solid',
  name: 'Daylight',
  scheme: 'light',
  surface: '#FFFFFF',
}

/**
 * Light and playful: frosted white containers over a rosé canvas with
 * pastel glows of peach, lilac, mint and rose blending into each other.
 */
export const BLOOM: StyleRecipe = {
  accent: '#7C5CC4',
  canvas: {
    base: '#EADCE6',
    glows: [
      { centerX: 0.05, centerY: 0.08, color: '#FFC4A3', radius: 0.55 },
      { centerX: 0.55, centerY: -0.05, color: '#D4BEFF', radius: 0.55 },
      { centerX: 0.88, centerY: 0.5, color: '#AEEFD8', radius: 0.58 },
      { centerX: 0.35, centerY: 1.05, color: '#FFBFD9', radius: 0.5 },
    ],
  },
  material: 'frosted',
  name: 'Bloom',
  scheme: 'light',
  surface: '#FFFFFF',
}

/** Styles the gallery offers, in its order. */
export const STYLE_RECIPES: StyleRecipe[] = [
  GRAPHITE,
  MIDNIGHT,
  DAYLIGHT,
  BLOOM,
]
