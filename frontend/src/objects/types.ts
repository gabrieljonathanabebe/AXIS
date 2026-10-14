import type {
  ChartFormatElement,
  ChartInstance,
  ChartType,
} from '../charts/types'

// ===== OBJECT ================================================================
/** Fields every dashboard object has, whatever its content. */
export type DashboardObjectBase = {
  id: string
  layout: ObjectLayout
  container: ObjectContainer
}

/** Everything placed on the dashboard canvas, told apart by `kind`. */
export type DashboardObject = ChartInstance

export type DashboardObjectKind = DashboardObject['kind']

/** What a picker option adds; the new object gets the defaults of its kind. */
export type ObjectTemplate = {
  chartType: ChartType
  kind: 'chart'
}

// ===== LAYOUT ================================================================
/** Position and size of an object on the canvas grid, in grid cells. */
export type ObjectLayout = {
  x: number
  y: number
  width: number
  height: number
}

/** Width and height of an object, in grid cells. */
export type ObjectSize = Pick<ObjectLayout, 'height' | 'width'>

// ===== CONTAINER =============================================================
/** Formatting of the container around an object's content. */
export type ObjectContainer = {
  background: ObjectBackground
  padding: number
  borderRadius: number
}

export type ObjectBackground =
  { kind: ObjectBackgroundPreset } | { kind: 'color'; color: string }

export type ObjectBackgroundPreset = 'surface' | 'glass' | 'blue' | 'violet'

// ===== ELEMENTS ==============================================================
/** Bounds of an element inside its object, in pixels. */
export type ElementRect = {
  height: number
  width: number
  x: number
  y: number
}

// ===== FORMAT ================================================================
/** Elements that can be formatted on an object; grows with each kind. */
export type ObjectFormatElement = ChartFormatElement

/** The element whose format popover is open, anchored to its object. */
export type FormatTarget = {
  anchor: HTMLElement
  element: ObjectFormatElement
  objectId: string
}
