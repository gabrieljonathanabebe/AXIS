import ContainerWidget from '../objects/ContainerWidget'
import ObjectTitleWidget from '../objects/ObjectTitleWidget'
import FormatPanel from '../shared/ui/FormatPanel'
import FormatWidget from '../shared/ui/FormatWidget'
import TextStyleControls from '../shared/ui/TextStyleControls'
import CardValueWidget from './CardValueWidget'
import { getCardAggregations } from './getCardAggregations'
import { getDefaultCardTitle } from './getCardTitle'

import type { ReactNode } from 'react'
import type { DataField } from '../datasets/types'
import type { FormatElementOption } from '../shared/ui/FormatPanel'
import type { FormatVisibility } from '../shared/ui/FormatWidget'
import type { CanvasActions } from '../workspace/types'
import type { CardFormatElement, CardInstance } from './types'

// ===== TYPES =================================================================
type CardFormatPanelProps = {
  actions: CanvasActions
  card: CardInstance
  element: CardFormatElement
  fields: DataField[]
  isCollapsed: boolean
  revealedGroup?: string | null
  onElementChange: (element: CardFormatElement) => void
  onToggleCollapse: () => void
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
  { actions, card, fields }: CardFormatPanelProps,
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
  { actions, card }: CardFormatPanelProps,
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
 * Shows the format widget of one card element in the format panel.
 * The element select switches between title and value.
 */
function CardFormatPanel(props: CardFormatPanelProps) {
  const {
    element,
    isCollapsed,
    revealedGroup,
    onElementChange,
    onToggleCollapse,
  } = props
  return (
    <FormatPanel
      elementSelect={{
        element,
        options: elementOptions,
        onChange: onElementChange,
      }}
      isCollapsed={isCollapsed}
      label="Card format"
      revealedGroup={revealedGroup}
      visibility={getElementVisibility(element, props)}
      onToggleCollapse={onToggleCollapse}
    >
      {renderFormatWidget(element, props)}
    </FormatPanel>
  )
}

export default CardFormatPanel
