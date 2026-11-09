import { isCardFormatElement } from '../cards/isCardFormatElement'
import {
  getFormatElements,
  isChartFormatElement,
} from '../charts/getFormatElements'

import type { DataField } from '../datasets/types'
import type { DashboardObject, ObjectFormatElement } from './types'

// ===== FUNCTION ==============================================================
/**
 * Picks the element the format panel shows for an object: the element
 * chosen last when the object has it, e.g. the legend from chart to chart,
 * else its container, "Chart" or "Card".
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
  const hasElement =
    object.kind === 'chart'
      ? isChartFormatElement(element) &&
        getFormatElements(object, fields).includes(element)
      : isCardFormatElement(element)
  return hasElement ? element : 'container'
}
