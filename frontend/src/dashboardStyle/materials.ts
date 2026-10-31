import { createColorValue } from '../shared/colorValue'
import { DEFAULT_INNER_SHADOW, DEFAULT_NOISE_SIZE } from '../shared/effect'
import { createColorStops, DEFAULT_RADIAL_SHAPE } from '../shared/paint'

import type { ColorValue } from '../shared/colorValue'
import type { ContainerEffect } from '../shared/effect'
import type { GradientStop, Paint } from '../shared/paint'
import type { StrokeStyle } from '../shared/strokeStyle'
import type { DashboardStyle, StyleColors, StyleRecipe } from './types'

// ===== TYPES =================================================================
type StyleContainer = DashboardStyle['container']

// ===== CONSTANTS =============================================================
/** Angle of material gradients: 127° in CSS, light from the top left. */
const MATERIAL_ANGLE = -37

/** Color of the drop shadows of materials. */
const SHADOW_COLOR = createColorValue('#000000')

/** Color of the light edge of glass. */
const LIGHT_COLOR = createColorValue('#FFFFFF')

/** Soft shadow that lifts a solid container off a light canvas. */
const SOFT_SHADOW: ContainerEffect = {
  blur: 24,
  color: createColorValue('#101828'),
  kind: 'shadow',
  offsetX: 0,
  offsetY: 4,
  opacity: 0.06,
}

// ===== HELPERS ===============================================================
/** Creates a solid paint of one color. */
function createSolidPaint(color: ColorValue): Paint {
  return { color, kind: 'solid' }
}

/**
 * Creates a linear gradient of one color along the material angle.
 * @param color Color of every stop.
 * @param stops Opacity and position of each stop.
 * @returns A linear gradient paint.
 */
function createMaterialGradient(
  color: ColorValue,
  stops: Omit<GradientStop, 'color'>[],
): Paint {
  return {
    ...DEFAULT_RADIAL_SHAPE,
    angle: MATERIAL_ANGLE,
    kind: 'gradient',
    stops: createColorStops(color, stops),
    type: 'linear',
  }
}

/**
 * Creates a solid border in the border color of the scheme.
 * @param colors Role colors of the style.
 * @param width Width in px; 0 hides the border.
 * @param opacity Opacity of the border.
 * @returns A solid stroke.
 */
function createBorder(
  colors: StyleColors,
  width: number,
  opacity: number,
): StrokeStyle {
  return {
    lineStyle: 'solid',
    opacity,
    paint: createSolidPaint(createColorValue(colors.border)),
    width,
  }
}

/** Solid: one surface and a fine border; on a light canvas a soft shadow. */
function createSolidContainer(
  recipe: StyleRecipe,
  colors: StyleColors,
): StyleContainer {
  return {
    background: [
      { opacity: 1, paint: createSolidPaint(createColorValue(recipe.surface)) },
    ],
    border: createBorder(colors, 1, 0.12),
    effects: recipe.scheme === 'light' ? [SOFT_SHADOW] : [],
  }
}

/**
 * Frosted: a fading surface over the blurred glow of the canvas, with
 * grain; no border, no shadow.
 */
function createFrostedContainer(
  recipe: StyleRecipe,
  colors: StyleColors,
): StyleContainer {
  return {
    background: [
      {
        opacity: 1,
        paint: createMaterialGradient(createColorValue(recipe.surface), [
          { opacity: 0.94, position: 0.19 },
          { opacity: 0.49, position: 0.77 },
        ]),
      },
    ],
    border: createBorder(colors, 0, 1),
    effects: [
      { blur: 40, kind: 'backgroundBlur' },
      { kind: 'noise', opacity: 0.04, size: DEFAULT_NOISE_SIZE },
    ],
  }
}

/**
 * Glass: a thin surface, a light edge as gradient border, an inner shadow,
 * background blur and a contact and depth shadow.
 */
function createGlassContainer(recipe: StyleRecipe): StyleContainer {
  return {
    background: [
      {
        opacity: 1,
        paint: createMaterialGradient(createColorValue(recipe.surface), [
          { opacity: 0.6, position: 0 },
          { opacity: 0.3, position: 1 },
        ]),
      },
    ],
    border: {
      lineStyle: 'solid',
      opacity: 1,
      paint: createMaterialGradient(LIGHT_COLOR, [
        { opacity: 0.5, position: 0 },
        { opacity: 0.05, position: 0.5 },
        { opacity: 0.15, position: 1 },
      ]),
      width: 1,
    },
    effects: [
      {
        blur: 2,
        color: SHADOW_COLOR,
        kind: 'shadow',
        offsetX: 0,
        offsetY: 1,
        opacity: 0.2,
      },
      {
        blur: 32,
        color: SHADOW_COLOR,
        kind: 'shadow',
        offsetX: 0,
        offsetY: 16,
        opacity: 0.24,
      },
      { blur: 24, kind: 'backgroundBlur' },
      { ...DEFAULT_INNER_SHADOW, kind: 'innerShadow' },
    ],
  }
}

// ===== FUNCTION ==============================================================
/**
 * Builds the container of a style from its material; the detail work of
 * every style lives here once.
 * @param recipe Recipe with material, scheme and surface color.
 * @param colors Role colors that follow from the scheme.
 * @returns Background, border and effects of every container.
 */
export function createMaterialContainer(
  recipe: StyleRecipe,
  colors: StyleColors,
): StyleContainer {
  switch (recipe.material) {
    case 'frosted':
      return createFrostedContainer(recipe, colors)
    case 'glass':
      return createGlassContainer(recipe)
    case 'solid':
      return createSolidContainer(recipe, colors)
  }
}
