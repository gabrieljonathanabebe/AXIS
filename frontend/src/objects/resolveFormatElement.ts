import { isCardFormatElement } from '../cards/isCardFormatElement'
import {
  getFormatElements,
  isChartFormatElement,
} from '../charts/getFormatElements'
import { getPanelElement } from './formatPanelElement'

import type { DataField } from '../datasets/types'
import type { DashboardObject, ObjectFormatElement } from './types'

// ===== FUNCTION ==============================================================
/**
 * Picks the element the format panel shows for an object: the element
 * chosen last when the object has it or its parent, e.g. the legend or the
 * data labels from chart to chart, else its container, "Chart" or "Card".
 * @param object Selected object.
 * @param element Element chosen last in the format panel.
 * @param fields Dataset fields, which decide whether a chart has a legend
 *   or a color scale.
 * @returns The element to show.
 */
export function resolveFormatElement(
  object: DashboardObject,
  element: ObjectFormatElement,
  fields: DataField[],
): ObjectFormatElement {
  const panelElement = getPanelElement(element)
  const hasElement =
    object.kind === 'chart'
      ? isChartFormatElement(panelElement) &&
        getFormatElements(object, fields).includes(panelElement)
      : isCardFormatElement(panelElement)
  return hasElement ? element : 'container'
}
