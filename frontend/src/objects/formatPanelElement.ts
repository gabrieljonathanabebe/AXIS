import type { ObjectFormatElement } from './types'

// ===== CONSTANTS =============================================================
/**
 * Small elements the format panel shows as a group of a larger one, e.g.
 * the data labels within the marks; every other element is a place of its
 * own in the panel.
 */
const formatParents: Partial<Record<ObjectFormatElement, ObjectFormatElement>> =
  {
    labels: 'marks',
    selectionLabel: 'value',
    tooltip: 'marks',
    xAxisLabels: 'xAxis',
    yAxisLabels: 'yAxis',
  }

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
  return formatParents[element] ?? element
}
