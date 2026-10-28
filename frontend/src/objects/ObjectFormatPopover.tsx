import { Eye, EyeOff, Paintbrush } from 'lucide-react'

import IconButton from '../shared/ui/IconButton'
import Popover from '../shared/ui/Popover'
import SelectControl from '../shared/ui/SelectControl'

import type { ReactNode } from 'react'
import type { FormatVisibility } from '../shared/ui/FormatWidget'
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
  visibility?: FormatVisibility
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
 * Shows the format groups of one element next to its object. The element
 * select switches between the elements of the same object. A visibility
 * puts an eye into the header that shows or hides the whole element, e.g.
 * the legend; while the element is hidden, only the header remains.
 */
function ObjectFormatPopover<TElement extends ObjectFormatElement>({
  children,
  element,
  elementOptions,
  label,
  target,
  visibility,
  onClose,
  onElementChange,
}: ObjectFormatPopoverProps<TElement>) {
  const elementLabel =
    elementOptions.find((option) => option.value === element)?.label ?? label
  const visibilityAction = visibility?.visible ? 'Hide' : 'Show'
  const showsGroups = visibility?.visible ?? true
  return (
    <Popover
      actions={
        visibility ? (
          <IconButton
            label={`${visibilityAction} ${elementLabel.toLowerCase()}`}
            size="xs"
            variant="ghost"
            onClick={() => visibility.onChange(!visibility.visible)}
          >
            {visibility.visible ? <Eye size={14} /> : <EyeOff size={14} />}
          </IconButton>
        ) : null
      }
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
      {showsGroups ? (
        <div className="format-popover-body stack">{children}</div>
      ) : null}
    </Popover>
  )
}

export default ObjectFormatPopover
