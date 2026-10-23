import type { CardFormatElement, CardInstance } from '../cards/types'
import type {
  ChartFormatElement,
  ChartInstance,
  ChartType,
} from '../charts/types'
import type { ColorValue } from '../shared/colorValue'
import type { StrokeStyle } from '../shared/strokeStyle'
import type { HorizontalAlignment, TextStyle } from '../shared/textStyle'

// ===== OBJECT ================================================================
/** Fields every dashboard object has, whatever its content. */
export type DashboardObjectBase = {
  id: string
  layout: ObjectLayout
  container: ObjectContainer
}

/** Everything placed on the dashboard canvas, told apart by `kind`. */
export type DashboardObject = ChartInstance | CardInstance

export type DashboardObjectKind = DashboardObject['kind']

/** What a picker option adds; the new object gets the defaults of its kind. */
export type ObjectTemplate =
  { chartType: ChartType; kind: 'chart' } | { kind: 'card' }

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
  border: StrokeStyle
  padding: number
  borderRadius: number
}

export type ObjectBackground =
  { kind: ObjectBackgroundPreset } | { kind: 'color'; color: ColorValue }

export type ObjectBackgroundPreset = 'surface' | 'glass' | 'blue' | 'violet'

/** Changes one property of a container, e.g. its padding. */
export type SetContainer = <TKey extends keyof ObjectContainer>(
  key: TKey,
  value: ObjectContainer[TKey],
) => void

// ===== TITLE =================================================================
/** Title above the content of an object; charts and cards share it. */
export type ObjectTitleAppearance = {
  alignment: HorizontalAlignment
  text: string
  textStyle: TextStyle
  visible: boolean
}

// ===== ELEMENTS ==============================================================
/** Bounds of an element inside its object, in pixels. */
export type ElementRect = {
  height: number
  width: number
  x: number
  y: number
}

// ===== FORMAT ================================================================
/** The object as a whole, its container; chosen by a click on free space. */
export type ContainerFormatElement = 'container'

/** Elements that can be formatted on an object; grows with each kind. */
export type ObjectFormatElement = ChartFormatElement | CardFormatElement

/** The element whose format popover is open, anchored to its object. */
export type FormatTarget = {
  anchor: HTMLElement
  element: ObjectFormatElement
  objectId: string
}
