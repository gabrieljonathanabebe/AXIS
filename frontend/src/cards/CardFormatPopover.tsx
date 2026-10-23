import ContainerWidget from '../objects/ContainerWidget'
import ObjectFormatPopover from '../objects/ObjectFormatPopover'
import ObjectTitleWidget from '../objects/ObjectTitleWidget'
import FormatWidget from '../shared/ui/FormatWidget'
import TextStyleControls from '../shared/ui/TextStyleControls'
import CardValueWidget from './CardValueWidget'
import { CARD_SELECTION_LABEL_TEXT_STYLE } from './createCardInstance'
import { getCardAggregations } from './getCardAggregations'
import { getDefaultCardTitle } from './getCardTitle'

import type { ReactNode } from 'react'
import type { DataField } from '../datasets/types'
import type { FormatElementOption } from '../objects/ObjectFormatPopover'
import type { FormatTarget } from '../objects/types'
import type { CanvasActions } from '../workspace/types'
import type { CardFormatElement, CardInstance } from './types'

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
  { label: 'Card', value: 'container' },
  { label: 'Title', value: 'title' },
  { label: 'Value', value: 'value' },
  { label: 'Selection', value: 'selectionLabel' },
]

// ===== HELPERS ===============================================================
/**
 * Picks the widget of one card element.
 * @param element Element in the popover.
 * @param props Card, its fields and the actions that change it.
 * @returns The widget of the element.
 */
function renderFormatWidget(
  element: CardFormatElement,
  { actions, card, fields }: CardFormatPopoverProps,
): ReactNode {
  const { appearance, data } = card.spec
  switch (element) {
    case 'container':
      return (
        <ContainerWidget
          value={card.container}
          onChange={(key, value) =>
            actions.updateObjectContainer(card.id, { [key]: value })
          }
        />
      )
    case 'selectionLabel':
      return (
        <FormatWidget
          title="Selection"
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
            defaultColor={CARD_SELECTION_LABEL_TEXT_STYLE.color}
            label="Selection"
            value={appearance.selectionLabel.textStyle}
            onChange={(textStyle) =>
              actions.updateCardAppearance(card.id, 'selectionLabel', {
                ...appearance.selectionLabel,
                textStyle,
              })
            }
          />
        </FormatWidget>
      )
    case 'title':
      return (
        <ObjectTitleWidget
          defaultTitle={getDefaultCardTitle(data)}
          value={appearance.title}
          onChange={(value) =>
            actions.updateCardAppearance(card.id, 'title', value)
          }
        />
      )
    case 'value':
      return (
        <FormatWidget title="Value">
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
        </FormatWidget>
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
      sections={[
        { content: renderFormatWidget(element, props), label: 'Format' },
      ]}
      target={target}
      onClose={onClose}
      onElementChange={onElementChange}
    />
  )
}

export default CardFormatPopover
