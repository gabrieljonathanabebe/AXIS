import { createColorValue } from '../shared/colorValue'
import { createColorStops, DEFAULT_GRADIENT_ANGLE } from '../shared/paint'
import { createMaterialContainer } from './materials'

import type { Shadow } from '../shared/effect'
import type { Fill } from '../shared/fill'
import type { DashboardCanvas } from '../workspace/types'
import type {
  CanvasGlow,
  ColorScheme,
  DashboardStyle,
  StyleColors,
  StyleRecipe,
  StyleTooltip,
} from './types'

// ===== CONSTANTS =============================================================
/** Role colors each scheme gives texts, axes, gridlines and borders. */
const SCHEME_COLORS: Record<ColorScheme, Omit<StyleColors, 'accent'>> = {
  dark: {
    axis: '#94A3B8',
    border: '#94A3B8',
    gridLine: '#334155',
    inactive: '#8B95A7',
    text: '#EEF4FF',
    textMuted: '#A7AFBD',
  },
  light: {
    axis: '#64748B',
    border: '#64748B',
    gridLine: '#64748B',
    inactive: '#98A2B3',
    text: '#101828',
    textMuted: '#667085',
  },
}

/**
 * Shared data palette, led by teal so data never looks like the blue
 * accent of the app; checked for color blindness on each scheme.
 */
const DATA_PALETTES: Record<ColorScheme, string[]> = {
  dark: ['#199E8A', '#D95926', '#8F80EC', '#C98500', '#D55181'],
  light: ['#199E8A', '#D95926', '#8F80EC', '#B57800', '#D55181'],
}

/** Opacity of marks outside the data selection. */
const DIMMED_OPACITIES: Record<ColorScheme, number> = {
  dark: 0.2,
  light: 0.25,
}

/** What the tooltip takes from the scheme: its veil and its shadow. */
const SCHEME_TOOLTIPS: Record<
  ColorScheme,
  { backgroundOpacity: number; shadow: Shadow }
> = {
  dark: {
    backgroundOpacity: 0.7,
    shadow: {
      blur: 42,
      color: createColorValue('#000000'),
      offsetX: 0,
      offsetY: 18,
      opacity: 0.34,
    },
  },
  light: {
    backgroundOpacity: 0.84,
    shadow: {
      blur: 42,
      color: createColorValue('#2F4867'),
      offsetX: 0,
      offsetY: 18,
      opacity: 0.16,
    },
  },
}

// ===== HELPERS ===============================================================
/**
 * Turns a glow into a fill of the canvas: a radial gradient of its color
 * that fades out toward its radius.
 * @param glow Color, center and size of the glow.
 * @returns A radial fill.
 */
function createGlowFill(glow: CanvasGlow): Fill {
  const { color, ...shape } = glow
  return {
    opacity: 1,
    paint: {
      ...shape,
      angle: DEFAULT_GRADIENT_ANGLE,
      kind: 'gradient',
      stops: createColorStops(createColorValue(color), [
        { opacity: 1, position: 0 },
        { opacity: 0, position: 1 },
      ]),
      type: 'radial',
    },
  }
}

/**
 * Builds the canvas: the glows on top, the base color below, in the order
 * of the background list.
 * @param recipe Recipe with base color and glows.
 * @returns The canvas as written into the spec.
 */
function createCanvas(recipe: StyleRecipe): DashboardCanvas {
  return {
    background: [
      ...recipe.canvas.glows.map(createGlowFill),
      {
        opacity: 1,
        paint: { color: createColorValue(recipe.canvas.base), kind: 'solid' },
      },
    ],
  }
}

/**
 * Builds the tooltip of every chart: a veil of the surface color with a
 * border in the accent of the dashboard.
 * @param recipe Recipe with scheme and surface color.
 * @param colors Role colors of the style.
 * @returns Fill, border, shadow and sizes of the tooltip.
 */
function createTooltip(recipe: StyleRecipe, colors: StyleColors): StyleTooltip {
  const { backgroundOpacity, shadow } = SCHEME_TOOLTIPS[recipe.scheme]
  return {
    background: {
      opacity: backgroundOpacity,
      paint: { color: createColorValue(recipe.surface), kind: 'solid' },
    },
    blur: 18,
    border: {
      lineStyle: 'solid',
      opacity: 0.42,
      paint: { color: createColorValue(colors.accent), kind: 'solid' },
      width: 1,
    },
    fontSize: 13,
    radius: 18,
    shadow,
  }
}

// ===== FUNCTION ==============================================================
/**
 * Turns a recipe into all values of a dashboard style. Pure, so the
 * workspace derives the style from the spec whenever it needs it.
 * @param recipe Few values the style is made of.
 * @returns Canvas, container, role colors, palette, dimming and tooltip.
 */
export function createDashboardStyle(recipe: StyleRecipe): DashboardStyle {
  const colors: StyleColors = {
    ...SCHEME_COLORS[recipe.scheme],
    accent: recipe.accent,
  }
  return {
    canvas: createCanvas(recipe),
    colors,
    container: createMaterialContainer(recipe, colors),
    dimmedOpacity: DIMMED_OPACITIES[recipe.scheme],
    palette: DATA_PALETTES[recipe.scheme],
    tooltip: createTooltip(recipe, colors),
  }
}
