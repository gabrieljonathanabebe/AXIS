import { getChartTitle } from '../charts/getChartTitle'
import { getCardTitle } from '../cards/getCardTitle'

import type { DashboardObject } from './types'
import type { DataField } from '../datasets/types'

/**
 * Names an object on the canvas for screen readers, after its title.
 * @param object Object to name.
 * @param fields Dataset fields, which default titles are built from.
 * @returns The title the object shows.
 */
export function getObjectLabel(
  object: DashboardObject,
  fields: DataField[],
): string {
  switch (object.kind) {
    case 'chart':
      return getChartTitle(object, fields)
    case 'card':
      return getCardTitle(object)
  }
}
