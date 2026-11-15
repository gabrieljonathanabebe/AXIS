// ===== TYPES =================================================================
/** Where an element or a text sits along its line, e.g. a title. */
export type HorizontalAlignment = 'start' | 'center' | 'end'

/** Edge of a surface an element sits at, e.g. the legend in a chart. */
export type Side = 'top' | 'right' | 'bottom' | 'left'

/** Direction in which an element lines up its items. */
export type Orientation = 'horizontal' | 'vertical'

/**
 * Where an element sits and how it spaces its content. Each element keeps
 * only the fields it has, e.g. `Pick<Layout, 'alignment'>` for a title,
 * and may narrow its positions, e.g. `Layout<'left' | 'right'>`.
 */
export type Layout<TPosition extends string = Side> = {
  /** Place along the side or line, e.g. a legend at the top, left. */
  alignment: HorizontalAlignment
  /** Space between the items, e.g. the entries of a legend. */
  gap: number
  orientation: Orientation
  /** Space between the edge and the content. */
  padding: number
  position: TPosition
}

/** Any part of a layout, e.g. only the alignment of a title. */
export type PartialLayout = Partial<Layout<string>>

/**
 * Position and size of an element on its surface, e.g. a chart on the
 * page. The element sets the unit, e.g. grid cells or pixels.
 */
export type Box = {
  height: number
  width: number
  x: number
  y: number
}

/** Smallest and largest allowed value; a missing bound stays open. */
export type NumberBounds = {
  max?: number
  min?: number
}

// ===== CONSTANTS =============================================================
const SIDES: string[] = ['top', 'right', 'bottom', 'left'] satisfies Side[]

/** Names of the sides, e.g. for a position field. */
const SIDE_LABELS = {
  bottom: 'Bottom',
  left: 'Left',
  right: 'Right',
  top: 'Top',
} satisfies Record<Side, string>

/** Words of a place along the top or bottom side. */
const ALIGNMENT_WORDS = {
  center: 'center',
  end: 'right',
  start: 'left',
} satisfies Record<HorizontalAlignment, string>

// ===== FUNCTIONS =============================================================
/**
 * Direction of an element at a side: along the top and bottom it runs
 * horizontally, along the left and right vertically, e.g. a legend.
 * @param side Side the element sits at.
 * @returns The orientation that follows from the side.
 */
export function getSideOrientation(side: Side): Orientation {
  return side === 'left' || side === 'right' ? 'vertical' : 'horizontal'
}

/**
 * Tells an edge from another position, e.g. a label inside its mark.
 * @param position Position of an element.
 * @returns True when the position is one of the four sides.
 */
export function isSide(position: string): position is Side {
  return SIDES.includes(position)
}

/**
 * Names a place around a plot, e.g. "Top left" for a legend at the top,
 * at the start. A left or right side, and a place without alignment, is
 * named by its side alone, e.g. "Right".
 * @param position Side the element sits at.
 * @param alignment Place along the side, if the element has one.
 * @returns The name, e.g. for a cell of the position grid or its field.
 */
export function getPlacementLabel(
  position: Side,
  alignment?: HorizontalAlignment,
): string {
  const side = SIDE_LABELS[position]
  if (!alignment || getSideOrientation(position) === 'vertical') {
    return side
  }
  return `${side} ${ALIGNMENT_WORDS[alignment]}`
}
