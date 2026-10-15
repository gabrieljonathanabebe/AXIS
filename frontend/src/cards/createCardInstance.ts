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
      title: {
        enabled: true,
        text: '',
        alignment: 'start',
      },
      value: {
        color: '#eef4ff',
        currency: 'EUR',
        fontSize: 40,
        fontWeight: 'bold',
        format: 'auto',
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
