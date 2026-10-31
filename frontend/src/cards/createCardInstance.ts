import {
  createDefaultContainer,
  createDefaultTitle,
} from '../objects/objectDefaults'
import { createColorValue } from '../shared/colorValue'
import { DEFAULT_NUMBER_FORMAT } from '../shared/format/valueFormats'

import type { DashboardStyle } from '../dashboardStyle/types'
import type { DataField } from '../datasets/types'
import type { ObjectLayout } from '../objects/types'
import type { CardDataSpec, CardInstance, CardSpec } from './types'

type CreateCardInstanceParams = {
  layout: ObjectLayout
  style: DashboardStyle
  id?: string
}

/**
 * Creates the spec of an empty card, which counts all rows.
 * @param style Current dashboard style, source of the text colors.
 * @returns Spec of a new card.
 */
export function createDefaultCardSpec(style: DashboardStyle): CardSpec {
  return {
    data: {
      field: null,
      aggregation: 'count',
    },
    appearance: {
      selectionLabel: {
        textStyle: {
          color: createColorValue(style.colors.accent),
          fontSize: 13,
          fontStyle: 'normal',
          fontWeight: 'medium',
        },
        visible: true,
      },
      title: createDefaultTitle(style),
      value: {
        numberFormat: DEFAULT_NUMBER_FORMAT,
        textStyle: {
          color: createColorValue(style.colors.text),
          fontSize: 40,
          fontStyle: 'normal',
          fontWeight: 'bold',
        },
      },
    },
  }
}

/**
 * Puts a dropped field on a card with the aggregation its role suggests.
 * @param field Field dropped on the card.
 * @returns Sum for measures; any other field is counted.
 */
export function createCardData(field: DataField): CardDataSpec {
  return {
    field: field.name,
    aggregation: field.semantic_role === 'measure' ? 'sum' : 'count',
  }
}

/**
 * Creates a card object with the default spec and the shared container.
 * @param params Layout, current style and an optional ID.
 * @returns A new card in the current style.
 */
export function createCardInstance({
  layout,
  style,
  id = crypto.randomUUID(),
}: CreateCardInstanceParams): CardInstance {
  return {
    id,
    kind: 'card',
    spec: createDefaultCardSpec(style),
    layout,
    container: createDefaultContainer(style),
  }
}
