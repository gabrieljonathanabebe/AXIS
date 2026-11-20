import type { ObjectContainer } from '@/objects/types'
import type { RadialShape } from '@/shared/paint'
import type { Surface } from '@/shared/surface'
import type { DashboardCanvas } from '@/workspace/types'

// ===== RECIPE ================================================================
/** Light or dark; decides texts, axes, gridlines, borders and dimming. */
export type ColorScheme = 'dark' | 'light'

/**
 * How containers are built from the surface color: one plain surface, a
 * frosted gradient over the canvas, or glass with a light edge.
 */
export type StyleMaterial = 'frosted' | 'glass' | 'solid'

/** Light on the canvas: a radial gradient of one color that fades out. */
export type CanvasGlow = RadialShape & { color: string }

/**
 * Few values a dashboard style is made of; `createDashboardStyle` turns
 * them into all values. Colors are hex colors.
 */
export type StyleRecipe = {
  accent: string
  canvas: {
    base: string
    glows: CanvasGlow[]
  }
  material: StyleMaterial
  name: string
  scheme: ColorScheme
  surface: string
}

// ===== STYLE =================================================================
/** Colors of the roles; the role names exist only in the style. */
export type StyleColors = {
  accent: string
  axis: string
  border: string
  gridLine: string
  inactive: string
  text: string
  textMuted: string
}

/**
 * All values that follow from a recipe: canvas, container and tooltip
 * surface as written into the spec, role colors and palette for the
 * defaults of new objects, dimming for every chart.
 */
export type DashboardStyle = {
  canvas: DashboardCanvas
  colors: StyleColors
  container: Pick<ObjectContainer, 'background' | 'border' | 'effects'>
  dimmedOpacity: number
  palette: string[]
  tooltip: Surface
}
