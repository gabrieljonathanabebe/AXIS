import ContainerElement from '@/objects/ContainerElement'
import { getObjectDefinition } from '@/objects/objectDefinitions'
import TitleElement from '@/objects/TitleElement'
import FormatPanel from '@/shared/ui/containers/FormatPanel'
import { getVisibility } from '@/shared/ui/groups/getVisibility'
import CardSelectionGroup from './CardSelectionGroup'
import CardValueElement from './CardValueElement'
import { getCardAggregations } from './getCardAggregations'
import { getDefaultCardTitle } from './getCardTitle'

import type { ReactNode } from 'react'
import type { DataField } from '@/datasets/types'
import type { FormatElementOption } from '@/shared/ui/containers/FormatPanel'
import type { FormatVisibility } from '@/shared/ui/groups/Group'
import type { CanvasActions } from '@/workspace/types'
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
]

// ===== HELPERS ===============================================================
/**
 * Lists the format groups of one card element, one below the other.
 * @param element Element shown in the panel.
 * @param props Card, its fields and the actions that change it.
 * @returns The groups of the element, each wired to its card action.
 */
function getFormatGroups(
  element: CardFormatElement,
  { actions, card, fields }: CardFormatPanelProps,
): ReactNode {
  const { appearance, data } = card.spec
  switch (element) {
    case 'container':
      return (
        <ContainerElement
          layout={card.layout}
          minSize={getObjectDefinition(card.kind).minSize}
          value={card.container}
          onChange={(key, value) =>
            actions.updateObjectContainer(card.id, { [key]: value })
          }
          onLayoutChange={(layout) =>
            actions.updateObjectLayout(card.id, layout)
          }
        />
      )
    case 'title':
      return (
        <TitleElement
          defaultTitle={getDefaultCardTitle(data)}
          value={appearance.title}
          onChange={(value) =>
            actions.updateCardAppearance(card.id, 'title', value)
          }
        />
      )
    case 'value':
      return (
        <>
          <CardValueElement
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
          <CardSelectionGroup
            value={appearance.selectionLabel}
            onChange={(value) =>
              actions.updateCardAppearance(card.id, 'selectionLabel', value)
            }
          />
        </>
      )
  }
}

/**
 * Eye that shows or hides a whole card element; it sits in the panel
 * header.
 * @param element Element in the popover.
 * @param props Card and the actions that change it.
 * @returns The visibility, or none for elements that always show.
 */
function getElementVisibility(
  element: CardFormatElement,
  { actions, card }: CardFormatPanelProps,
): FormatVisibility | undefined {
  const { title } = card.spec.appearance
  switch (element) {
    case 'title':
      return getVisibility(title, (value) =>
        actions.updateCardAppearance(card.id, 'title', value),
      )
    default:
      return undefined
  }
}

// ===== COMPONENT =============================================================
/**
 * Shows the format group of one card element in the format panel.
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
      {getFormatGroups(element, props)}
    </FormatPanel>
  )
}

export default CardFormatPanel
