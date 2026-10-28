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
import type { FormatVisibility } from '../shared/ui/FormatWidget'
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
        <FormatWidget title="Text">
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
      )
  }
}

/**
 * Eye that shows or hides a whole card element; it sits in the popover
 * header.
 * @param element Element in the popover.
 * @param props Card and the actions that change it.
 * @returns The visibility, or none for elements that always show.
 */
function getElementVisibility(
  element: CardFormatElement,
  { actions, card }: CardFormatPopoverProps,
): FormatVisibility | undefined {
  const { selectionLabel, title } = card.spec.appearance
  switch (element) {
    case 'selectionLabel':
      return {
        visible: selectionLabel.visible,
        onChange: (visible) =>
          actions.updateCardAppearance(card.id, 'selectionLabel', {
            ...selectionLabel,
            visible,
          }),
      }
    case 'title':
      return {
        visible: title.visible,
        onChange: (visible) =>
          actions.updateCardAppearance(card.id, 'title', { ...title, visible }),
      }
    default:
      return undefined
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
      visibility={getElementVisibility(element, props)}
      onClose={onClose}
      onElementChange={onElementChange}
    >
      {renderFormatWidget(element, props)}
    </ObjectFormatPopover>
  )
}

export default CardFormatPopover
