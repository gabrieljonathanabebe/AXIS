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

// ===== CONSTANTS =============================================================
const SIDES: string[] = ['top', 'right', 'bottom', 'left'] satisfies Side[]

// ===== FUNCTIONS =============================================================
/**
 * Tells an edge from another position, e.g. a label inside its mark.
 * @param position Position of an element.
 * @returns True when the position is one of the four sides.
 */
export function isSide(position: string): position is Side {
  return SIDES.includes(position)
}
