import type { ObjectFormatElement } from './types'

// ===== CONSTANTS =============================================================
/**
 * Small elements the format panel shows as a group of a larger one, e.g.
 * the data labels within the marks; every other element is a place of its
 * own in the panel. Each such group carries its element as
 * `data-format-group`.
 */
const formatGroups = [
  { element: 'labels', parent: 'marks' },
  { element: 'selectionLabel', parent: 'value' },
  { element: 'tooltip', parent: 'marks' },
  { element: 'xAxisLabels', parent: 'xAxis' },
  { element: 'yAxisLabels', parent: 'yAxis' },
] satisfies { element: ObjectFormatElement; parent: ObjectFormatElement }[]

// ===== FUNCTIONS =============================================================
/**
 * Finds the element the format panel opens for an element of an object,
 * e.g. the marks for a click on a data label.
 * @param element Element that was clicked or chosen.
 * @returns Its parent, or the element itself when it has none.
 */
export function getPanelElement(
  element: ObjectFormatElement,
): ObjectFormatElement {
  const group = formatGroups.find((item) => item.element === element)
  return group?.parent ?? element
}
