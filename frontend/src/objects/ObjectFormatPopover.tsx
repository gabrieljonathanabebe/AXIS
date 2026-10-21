import { Paintbrush } from 'lucide-react'
import { useState } from 'react'

import Popover from '../shared/ui/Popover'
import SegmentedControl from '../shared/ui/SegmentedControl'
import SelectControl from '../shared/ui/SelectControl'

import type { FormatTarget, ObjectFormatElement } from './types'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

// ===== TYPES =================================================================
export type FormatElementOption<TElement extends ObjectFormatElement> = {
  label: string
  value: TElement
}

/** One part of an element's settings; several switch by a segmented control. */
export type FormatSection = {
  content: ReactNode
  icon?: LucideIcon
  label: string
}

type ObjectFormatPopoverProps<TElement extends ObjectFormatElement> = {
  element: TElement
  elementOptions: FormatElementOption<TElement>[]
  label: string
  sections: FormatSection[]
  target: FormatTarget
  onClose: () => void
  onElementChange: (element: TElement) => void
}

// ===== HELPERS ===============================================================
/**
 * Selects where presses keep the popover open: the canvas toolbar (undo,
 * redo, the format toggle) and the formatted object, whose regions switch
 * the element.
 */
function getKeepOpenSelector(objectId: string): string {
  return `.canvas-toolbar, [data-object-id="${objectId}"]`
}

// ===== COMPONENT =============================================================
/**
 * Shows the format settings of one element next to its object. The element
 * select switches between the elements of the same object, a segmented
 * control between the sections of an element. The active section is kept by
 * its label, so it stays when the next element has a section of that name.
 */
function ObjectFormatPopover<TElement extends ObjectFormatElement>({
  element,
  elementOptions,
  label,
  sections,
  target,
  onClose,
  onElementChange,
}: ObjectFormatPopoverProps<TElement>) {
  const [activeLabel, setActiveLabel] = useState<string | null>(null)
  const activeSection =
    sections.find((section) => section.label === activeLabel) ?? sections[0]
  return (
    <Popover
      anchor={target.anchor}
      className="format-popover glass glass-thick"
      keepOpenOn={getKeepOpenSelector(target.objectId)}
      label={label}
      open
      placement="right-start"
      title={
        <span className="format-popover-title cluster">
          <Paintbrush aria-hidden="true" size={16} />
          <SelectControl
            label="Format element"
            options={elementOptions}
            value={element}
            variant="title"
            onChange={onElementChange}
          />
        </span>
      }
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <div className="format-popover-body stack">
        {sections.length > 1 ? (
          <SegmentedControl
            label="Format section"
            options={sections.map((section) => ({
              label: section.label,
              value: section.label,
            }))}
            renderOption={(option) => {
              const Icon = sections.find(
                (section) => section.label === option.value,
              )?.icon
              return Icon ? <Icon aria-hidden="true" size={15} /> : option.label
            }}
            value={activeSection.label}
            onValueChange={setActiveLabel}
          />
        ) : null}
        {activeSection.content}
      </div>
    </Popover>
  )
}

export default ObjectFormatPopover
