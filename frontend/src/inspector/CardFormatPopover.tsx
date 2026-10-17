import CardValueWidget from '../cards/CardValueWidget'
import ChartTitleWidget from './appearance/ChartTitleWidget'
import InspectorWidget from './InspectorWidget'
import ObjectFormatPopover from '../objects/ObjectFormatPopover'
import TextStyleControls from '../shared/ui/TextStyleControls'
import { getCardAggregations } from '../cards/getCardAggregations'
import { getDefaultCardTitle } from '../cards/getCardTitle'

import type { ReactNode } from 'react'
import type { CanvasActions } from '../workspace/types'
import type { CardFormatElement, CardInstance } from '../cards/types'
import type { DataField } from '../datasets/types'
import type { FormatElementOption } from '../objects/ObjectFormatPopover'
import type { FormatTarget } from '../objects/types'

// ===== TYPES =================================================================
type CardFormatPopoverProps = {
  actions: CanvasActions
  card: CardInstance
  element: CardFormatElement
  fields: DataField[]
  target: FormatTarget
  onClose: () => void
  onElementChange: (element: CardFormatElement) => void
}

// ===== CONSTANTS =============================================================
const elementOptions: FormatElementOption<CardFormatElement>[] = [
  { label: 'Title', value: 'title' },
  { label: 'Value', value: 'value' },
  { label: 'Selection', value: 'selectionLabel' },
]

// ===== HELPERS ===============================================================
/**
 * Picks the widget of one card element.
 * @param element Element in the popover.
 * @param props Card, its fields and the actions that change it.
 * @returns The title widget or the value widget.
 */
function renderFormatWidget(
  element: CardFormatElement,
  { actions, card, fields }: CardFormatPopoverProps,
): ReactNode {
  const { appearance, data } = card.spec
  switch (element) {
    case 'selectionLabel':
      return (
        <InspectorWidget
          title="Selection"
          variant="bare"
          visibility={{
            visible: appearance.selectionLabel.visible,
            onChange: (visible) =>
              actions.updateCardAppearance(card.id, 'selectionLabel', {
                ...appearance.selectionLabel,
                visible,
              }),
          }}
        >
          <TextStyleControls
            label="Selection"
            value={appearance.selectionLabel.textStyle}
            onChange={(textStyle) =>
              actions.updateCardAppearance(card.id, 'selectionLabel', {
                ...appearance.selectionLabel,
                textStyle,
              })
            }
          />
        </InspectorWidget>
      )
    case 'title':
      return (
        <ChartTitleWidget
          defaultTitle={getDefaultCardTitle(data)}
          value={appearance.title}
          variant="bare"
          onChange={(value) =>
            actions.updateCardAppearance(card.id, 'title', value)
          }
        />
      )
    case 'value':
      return (
        <InspectorWidget title="Value" variant="bare">
          <CardValueWidget
            aggregation={data.aggregation}
            aggregations={getCardAggregations(
              fields.find((field) => field.name === data.field),
            )}
            value={appearance.value}
            onAggregationChange={(aggregation) =>
              actions.updateCardData(card.id, { aggregation })
            }
            onChange={(value) =>
              actions.updateCardAppearance(card.id, 'value', value)
            }
          />
        </InspectorWidget>
      )
  }
}

// ===== COMPONENT =============================================================
/**
 * Shows the format widget of one card element next to the card.
 * The element select switches between title and value.
 */
function CardFormatPopover(props: CardFormatPopoverProps) {
  const { element, target, onClose, onElementChange } = props
  return (
    <ObjectFormatPopover
      element={element}
      elementOptions={elementOptions}
      label="Card format"
      target={target}
      onClose={onClose}
      onElementChange={onElementChange}
    >
      {renderFormatWidget(element, props)}
    </ObjectFormatPopover>
  )
}

export default CardFormatPopover
