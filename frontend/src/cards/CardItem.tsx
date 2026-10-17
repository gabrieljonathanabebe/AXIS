import DropSlot from '../workspace/DropSlot'
import EditableText from '../shared/ui/EditableText'
import { getTextStyleCss } from '../shared/textStyle'
import { getRectInFrame } from '../objects/elementRect'
import { getFormatFocusClassName } from '../objects/getFormatFocusClassName'
import { getDefaultCardTitle } from './getCardTitle'
import { useCardQuery } from './useCardQuery'
import {
  createNumberFormatter,
  formatCompactNumber,
} from '../shared/format/formatNumber'
import {
  formatSelectionLabel,
  getSelectionQueryFilters,
} from '../workspace/dataSelection'

import type { CanvasActions, DataSelection } from '../workspace/types'
import type {
  CardFormatElement,
  CardInstance,
  CardValueAppearance,
} from './types'
import type { DataField } from '../datasets/types'
import type { ObjectFormatElement } from '../objects/types'
import type { ShowFormatHint } from '../objects/ObjectFrame'

// ===== TYPES =================================================================
type CardItemProps = {
  actions: CanvasActions
  card: CardInstance
  datasetId: string | null
  draggedField: DataField | null
  formattedElement: ObjectFormatElement | null
  selection: DataSelection | null
  onFormatHint: ShowFormatHint
}

// ===== HELPERS ===============================================================
/**
 * Formats the value of a card; auto keeps large numbers short.
 * @param value Aggregated value, or null when no row has one.
 * @param appearance Number format and currency of the value.
 * @returns The text the card shows, a dash for no value.
 */
function formatCardValue(
  value: number | null,
  { currency, format }: CardValueAppearance,
): string {
  if (value === null) {
    return '–'
  }
  return format === 'auto'
    ? formatCompactNumber(value)
    : createNumberFormatter(format, currency)(value)
}

/**
 * Names the selection below the card value, e.g. "United States". A
 * brushed range only says "Filtered"; its full text would be long and
 * restless.
 * @param selection Current selection, or null.
 * @returns The hint, empty without a selection.
 */
function getSelectionHint(selection: DataSelection | null): string {
  if (!selection) {
    return ''
  }
  if (selection.filters.some(({ kind }) => kind === 'range')) {
    return 'Filtered'
  }
  return formatSelectionLabel(selection)
}

// ===== COMPONENT =============================================================
/**
 * Shows a card inside its object frame: optional title and the
 * aggregated value. The value follows the selection, a label below
 * names it. Each element reports itself as format hint; while a field
 * is dragged, a drop slot sets the value field.
 */
function CardItem({
  actions,
  card,
  datasetId,
  draggedField,
  formattedElement,
  selection,
  onFormatHint,
}: CardItemProps) {
  const { selectionLabel, title, value } = card.spec.appearance
  const query = useCardQuery(
    datasetId,
    card.spec.data,
    getSelectionQueryFilters(selection),
  )
  const cardValue = query.result?.value ?? null

  /** Remembers the element under the pointer as format hint. */
  function showHint(element: CardFormatElement, target: HTMLElement): void {
    const rect = getRectInFrame(target)
    if (rect) {
      onFormatHint(element, rect)
    }
  }

  return (
    <>
      {draggedField ? (
        <div className="encoding-drop-slots is-single">
          <DropSlot
            ariaLabel={`Drop ${draggedField.name} to set Value`}
            className={card.spec.data.field ? 'is-filled' : ''}
            id={`card:${card.id}:value`}
            label="Value"
            target={{ cardId: card.id, kind: 'card' }}
            valueText={
              card.spec.data.field
                ? `Replaces ${card.spec.data.field}`
                : 'Drop here'
            }
          />
        </div>
      ) : null}
      <div className="card-item">
        {title.visible ? (
          <div
            className={`card-item-title ${getFormatFocusClassName('title', formattedElement)}`}
            style={{
              ...getTextStyleCss(title.textStyle),
              textAlign: title.alignment,
            }}
          >
            <EditableText
              label="Card title"
              placeholder={getDefaultCardTitle(card.spec.data)}
              value={title.text}
              onCommit={(text) =>
                actions.updateCardAppearance(card.id, 'title', {
                  ...title,
                  text,
                })
              }
              onPointerEnter={(event) => showHint('title', event.currentTarget)}
            />
          </div>
        ) : null}
        <div className="card-item-body">
          <span
            className={`card-item-value ${getFormatFocusClassName('value', formattedElement)}`}
            style={getTextStyleCss(value.textStyle)}
            onPointerEnter={(event) => showHint('value', event.currentTarget)}
          >
            {query.isLoading && !query.result
              ? '…'
              : formatCardValue(cardValue, value)}
          </span>
          {selectionLabel.visible ? (
            <span
              className={`card-item-selection ${getFormatFocusClassName('selectionLabel', formattedElement)}`}
              style={getTextStyleCss(selectionLabel.textStyle)}
              onPointerEnter={(event) =>
                showHint('selectionLabel', event.currentTarget)
              }
            >
              {getSelectionHint(selection)}
            </span>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default CardItem
