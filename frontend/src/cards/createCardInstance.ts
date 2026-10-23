import {
  createDefaultContainer,
  createDefaultTitle,
} from '../objects/objectDefaults'
import { DEFAULT_NUMBER_FORMAT } from '../shared/format/valueFormats'

import type { DataField } from '../datasets/types'
import type { ObjectLayout } from '../objects/types'
import type { TextStyle } from '../shared/textStyle'
import type { CardDataSpec, CardInstance, CardSpec } from './types'

/** Default look of the card value, the large number. */
export const CARD_VALUE_TEXT_STYLE: TextStyle = {
  color: { kind: 'token', token: 'text' },
  fontSize: 40,
  fontStyle: 'normal',
  fontWeight: 'bold',
}

/** Default look of the label that names the active selection. */
export const CARD_SELECTION_LABEL_TEXT_STYLE: TextStyle = {
  color: { kind: 'token', token: 'accent' },
  fontSize: 13,
  fontStyle: 'normal',
  fontWeight: 'medium',
}

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
        textStyle: CARD_SELECTION_LABEL_TEXT_STYLE,
        visible: true,
      },
      title: createDefaultTitle(),
      value: {
        numberFormat: DEFAULT_NUMBER_FORMAT,
        textStyle: CARD_VALUE_TEXT_STYLE,
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
    container: createDefaultContainer(),
  }
}
