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
