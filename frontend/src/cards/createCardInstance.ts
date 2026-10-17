import { createDefaultChartContainer } from '../charts/createChartInstance'

import type { CardDataSpec, CardInstance, CardSpec } from './types'
import type { DataField } from '../datasets/types'
import type { ObjectLayout } from '../objects/types'

type CreateCardInstanceParams = {
  layout: ObjectLayout
  id?: string
}

/** Creates the spec of an empty card, which counts all rows. */
export function createDefaultCardSpec(): CardSpec {
  return {
    data: {
      field: null,
      aggregation: 'count',
    },
    appearance: {
      selectionLabel: {
        textStyle: {
          color: '#178bff',
          fontSize: 13,
          fontStyle: 'normal',
          fontWeight: 'medium',
        },
        visible: true,
      },
      title: {
        visible: true,
        text: '',
        alignment: 'start',
        textStyle: {
          color: '#eef4ff',
          fontSize: 14,
          fontStyle: 'normal',
          fontWeight: 'medium',
        },
      },
      value: {
        currency: 'EUR',
        format: 'auto',
        textStyle: {
          color: '#eef4ff',
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

/** Creates a card object with the default spec and the shared container. */
export function createCardInstance({
  layout,
  id = crypto.randomUUID(),
}: CreateCardInstanceParams): CardInstance {
  return {
    id,
    kind: 'card',
    spec: createDefaultCardSpec(),
    layout,
    container: createDefaultChartContainer(),
  }
}
