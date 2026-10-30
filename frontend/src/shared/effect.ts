import { getColorCss } from './colorValue'

import type { ColorValue } from './colorValue'

// ===== TYPES =================================================================
/**
 * Offset, blurred copy of a shape behind it, like a drop shadow in Figma.
 * Marks and containers share it; the kind decides where it is drawn.
 */
export type Shadow = {
  blur: number
  color: ColorValue
  offsetX: number
  offsetY: number
  opacity: number
}

/**
 * How a mark stands out from the chart: no effect, a glow (a blurred
 * shadow without offset in the color of the mark) or an offset shadow.
 * One effect per mark, because ECharts draws one shadow per mark.
 */
export type Effect =
  | { kind: 'none' }
  | { blur: number; kind: 'glow' }
  | ({ kind: 'shadow' } & Shadow)

/**
 * One effect of a container. A container keeps a list; the kind fixes the
 * layer it is drawn on, so the order of the list does not matter.
 */
export type ContainerEffect =
  | ({ kind: 'shadow' } & Shadow)
  | ({ kind: 'innerShadow' } & Shadow)
  | { blur: number; kind: 'backgroundBlur' }
  | { kind: 'noise'; opacity: number; size: number }

/** Layers of the container effects from the bottom, as the list shows. */
const CONTAINER_EFFECT_ORDER: ContainerEffect['kind'][] = [
  'shadow',
  'backgroundBlur',
  'noise',
  'innerShadow',
]

/** Kinds a container takes at most once; shadows may stack. */
const SINGLE_CONTAINER_EFFECTS: ContainerEffect['kind'][] = [
  'backgroundBlur',
  'noise',
]

// ===== CONSTANTS =============================================================
/** Blur a glow starts with when the effect is switched on. */
export const DEFAULT_GLOW_BLUR = 12

/** Soft shadow a new shadow starts with; reaches 16px below the shape. */
export const DEFAULT_SHADOW: Shadow = {
  blur: 12,
  color: { kind: 'custom', color: '#000000' },
  offsetX: 0,
  offsetY: 4,
  opacity: 0.25,
}

/** Inner shadow a new one starts with: a faint light edge at the top. */
export const DEFAULT_INNER_SHADOW: Shadow = {
  blur: 0,
  color: { kind: 'custom', color: '#ffffff' },
  offsetX: 0,
  offsetY: 1,
  opacity: 0.08,
}

/** Blur of the backdrop a new background blur starts with, in px. */
export const DEFAULT_BACKGROUND_BLUR = 16

/** Intensity a new noise starts with, as opacity of the grain tile. */
export const DEFAULT_NOISE_OPACITY = 0.08

/** Edge length of the grain tile a new noise starts with, in px. */
export const DEFAULT_NOISE_SIZE = 100

// ===== FUNCTIONS =============================================================
/**
 * Creates the effect of one kind with its default values.
 * @param kind Kind to create, e.g. from the select of the effect row.
 * @returns No effect, a glow or a shadow with the default values.
 */
export function createEffect(kind: Effect['kind']): Effect {
  switch (kind) {
    case 'glow':
      return { blur: DEFAULT_GLOW_BLUR, kind }
    case 'none':
      return { kind }
    case 'shadow':
      return { ...DEFAULT_SHADOW, kind }
  }
}

/**
 * Creates a container effect of one kind with its default values.
 * @param kind Kind to create, e.g. a shadow by the plus of the group.
 * @returns The effect with the default values of its kind.
 */
export function createContainerEffect(
  kind: ContainerEffect['kind'],
): ContainerEffect {
  switch (kind) {
    case 'backgroundBlur':
      return { blur: DEFAULT_BACKGROUND_BLUR, kind }
    case 'innerShadow':
      return { ...DEFAULT_INNER_SHADOW, kind }
    case 'noise':
      return { kind, opacity: DEFAULT_NOISE_OPACITY, size: DEFAULT_NOISE_SIZE }
    case 'shadow':
      return { ...DEFAULT_SHADOW, kind }
  }
}

/**
 * Turns shadows into a CSS box-shadow list, e.g. the drop shadows of a
 * container. The first shadow lies on top, as in CSS.
 * @param shadows Shadows of one kind.
 * @param inset Whether the shadows fall inward, e.g. a light edge.
 * @returns A box-shadow value, or `none` without shadows.
 */
export function getShadowsCss(shadows: Shadow[], inset = false): string {
  if (shadows.length === 0) {
    return 'none'
  }
  return shadows
    .map(({ blur, color, offsetX, offsetY, opacity }) => {
      const offset = `${offsetX}px ${offsetY}px ${blur}px`
      return `${inset ? 'inset ' : ''}${offset} ${getColorCss(color, opacity)}`
    })
    .join(', ')
}

/**
 * Sorts the effects of a container by their layers from the bottom, the
 * order the list shows; effects of one kind keep their order.
 * @param effects Effects of a container, e.g. after a kind changed.
 * @returns A new sorted list.
 */
export function sortContainerEffects(
  effects: ContainerEffect[],
): ContainerEffect[] {
  return [...effects].sort((first, second) => {
    return (
      CONTAINER_EFFECT_ORDER.indexOf(first.kind) -
      CONTAINER_EFFECT_ORDER.indexOf(second.kind)
    )
  })
}

/**
 * Tells whether a container already has an effect it takes only once,
 * e.g. a background blur, so the kind select offers it disabled.
 * @param effects Effects of a container.
 * @param kind Kind to check.
 * @returns True when the kind is single and already in the list.
 */
export function isContainerEffectTaken(
  effects: ContainerEffect[],
  kind: ContainerEffect['kind'],
): boolean {
  return (
    SINGLE_CONTAINER_EFFECTS.includes(kind) &&
    effects.some((effect) => effect.kind === kind)
  )
}
