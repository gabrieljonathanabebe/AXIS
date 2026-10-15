import type {
  DashboardObject,
  ObjectLayout,
  ObjectSize,
} from '../objects/types'

// ===== TYPES =================================================================
export type GridDelta = Pick<ObjectLayout, 'x' | 'y'>

export type ResizeEdges = {
  bottom: boolean
  left: boolean
  right: boolean
  top: boolean
}

// ===== CONSTANTS =============================================================
export const CHART_GRID = {
  columns: 24,
  rowHeight: 16,
}

// ===== HELPERS ===============================================================
function isOverlapping(first: ObjectLayout, second: ObjectLayout): boolean {
  return (
    first.x < second.x + second.width &&
    second.x < first.x + first.width &&
    first.y < second.y + second.height &&
    second.y < first.y + first.height
  )
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Sorts objects top to bottom, then left to right. */
function compareReadingOrder(
  first: DashboardObject,
  second: DashboardObject,
): number {
  return first.layout.y - second.layout.y || first.layout.x - second.layout.x
}

// ===== FUNCTIONS =============================================================
/**
 * Finds the first free spot for an object, row by row from the top left.
 * @param objects Objects already on the canvas.
 * @param size Size of the new object.
 * @returns A layout that overlaps no object.
 */
export function findFreeLayout(
  objects: DashboardObject[],
  size: ObjectSize,
): ObjectLayout {
  const width = Math.min(size.width, CHART_GRID.columns)
  for (let y = 0; ; y += 1) {
    for (let x = 0; x + width <= CHART_GRID.columns; x += 1) {
      const layout = { height: size.height, width, x, y }
      const isFree = objects.every((object) => {
        return !isOverlapping(object.layout, layout)
      })
      if (isFree) {
        return layout
      }
    }
  }
}

/**
 * Finds the object to select when another one is removed.
 * @param objects Objects before the removal.
 * @param objectId Object that is removed.
 * @returns The next object in reading order, else the previous one, or null.
 */
export function findNeighborObjectId(
  objects: DashboardObject[],
  objectId: string,
): string | null {
  const ordered = [...objects].sort(compareReadingOrder)
  const index = ordered.findIndex((object) => object.id === objectId)
  if (index === -1) {
    return null
  }
  return ordered[index + 1]?.id ?? ordered[index - 1]?.id ?? null
}

/** Moves a layout by grid cells without leaving the grid. */
export function moveLayout(
  layout: ObjectLayout,
  delta: GridDelta,
): ObjectLayout {
  return {
    ...layout,
    x: clamp(layout.x + delta.x, 0, CHART_GRID.columns - layout.width),
    y: Math.max(layout.y + delta.y, 0),
  }
}

/**
 * Resizes a layout by moving the given edges, down to the minimum size.
 * @param layout Current layout.
 * @param delta Change in grid cells.
 * @param edges Edges that follow the change.
 * @param minSize Smallest size the object may get.
 * @returns The resized layout, without leaving the grid.
 */
export function resizeLayout(
  layout: ObjectLayout,
  delta: GridDelta,
  edges: ResizeEdges,
  minSize: ObjectSize,
): ObjectLayout {
  const right = layout.x + layout.width
  const bottom = layout.y + layout.height
  const x = edges.left
    ? clamp(layout.x + delta.x, 0, right - minSize.width)
    : layout.x
  const y = edges.top
    ? clamp(layout.y + delta.y, 0, bottom - minSize.height)
    : layout.y
  const width = edges.right
    ? clamp(
        layout.width + delta.x,
        minSize.width,
        CHART_GRID.columns - layout.x,
      )
    : right - x
  const height = edges.bottom
    ? Math.max(layout.height + delta.y, minSize.height)
    : bottom - y
  return { height, width, x, y }
}
