import ControlRow from '../shared/ui/ControlRow'
import Popover from '../shared/ui/Popover'
import SelectControl from '../shared/ui/SelectControl'

import type { ReactNode } from 'react'
import type { FormatTarget, ObjectFormatElement } from './types'

// ===== TYPES =================================================================
export type FormatElementOption<TElement extends ObjectFormatElement> = {
  label: string
  value: TElement
}

type ObjectFormatPopoverProps<TElement extends ObjectFormatElement> = {
  children: ReactNode
  element: TElement
  elementOptions: FormatElementOption<TElement>[]
  label: string
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
 * Shows the format widget of one element next to its object. The element
 * select switches between the elements of the same object; the widget
 * comes from `children`.
 */
function ObjectFormatPopover<TElement extends ObjectFormatElement>({
  children,
  element,
  elementOptions,
  label,
  target,
  onClose,
  onElementChange,
}: ObjectFormatPopoverProps<TElement>) {
  return (
    <Popover
      anchor={target.anchor}
      className="chart-format-popover glass glass-thick"
      keepOpenOn={getKeepOpenSelector(target.objectId)}
      label={label}
      open
      placement="right-start"
      title="Format"
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <div className="stack">
        <ControlRow label="Element">
          <SelectControl
            label="Format element"
            options={elementOptions}
            value={element}
            onChange={onElementChange}
          />
        </ControlRow>
        {children}
      </div>
    </Popover>
  )
}

export default ObjectFormatPopover
