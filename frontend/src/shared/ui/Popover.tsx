import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  offset,
  shift,
  size,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { useState } from 'react'

import { ClosePopover } from './popoverContext'

import type { Placement } from '@floating-ui/react'
import type { ReactNode, RefCallback } from 'react'

type PopoverRole = 'dialog' | 'listbox'

/** Kind of popover: `editor` opens left of its trigger with editor width. */
type PopoverVariant = 'default' | 'editor'

export type PopoverTriggerProps = {
  ref: RefCallback<HTMLButtonElement>
  'aria-expanded': boolean
  'aria-haspopup': PopoverRole
  onClick: () => void
}

type PopoverProps = {
  label: string
  open?: boolean
  children: ReactNode
  className?: string
  placement?: Placement
  role?: PopoverRole
  flipsAlignment?: boolean
  matchTriggerWidth?: boolean
  variant?: PopoverVariant
  onOpenChange?: (open: boolean) => void
  renderTrigger: (props: PopoverTriggerProps) => ReactNode
}

/** Floating surface of one popover, positioned at its trigger. */
function PopoverNode({
  label,
  open,
  children,
  className = '',
  placement,
  role = 'dialog',
  matchTriggerWidth = false,
  flipsAlignment,
  variant = 'default',
  onOpenChange,
  renderTrigger,
}: PopoverProps) {
  const isEditor = variant === 'editor'
  const [ownOpen, setOwnOpen] = useState(false)
  const isOpen = open ?? ownOpen
  const setIsOpen = onOpenChange ?? setOwnOpen
  const nodeId = useFloatingNodeId()
  const {
    context,
    floatingStyles,
    refs: { setFloating, setReference },
  } = useFloating<HTMLButtonElement>({
    nodeId,
    open: isOpen,
    placement: placement ?? (isEditor ? 'left-start' : 'bottom-end'),
    strategy: 'fixed',
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({
        crossAxis: flipsAlignment ?? !isEditor,
        padding: 12,
      }),
      shift({
        crossAxis: true,
        padding: 12,
      }),
      matchTriggerWidth
        ? size({
            padding: 12,
            apply({ availableWidth, elements, rects }) {
              Object.assign(elements.floating.style, {
                maxWidth: `${availableWidth}px`,
                minWidth: `${rects.reference.width}px`,
              })
            },
          })
        : undefined,
    ],
  })

  const dismiss = useDismiss(context)
  const floatingRole = useRole(context, {
    role,
  })

  const { getFloatingProps } = useInteractions([dismiss, floatingRole])

  return (
    <>
      {renderTrigger({
        ref: setReference,
        'aria-expanded': isOpen,
        'aria-haspopup': role,
        onClick: () => setIsOpen(!isOpen),
      })}

      <FloatingNode id={nodeId}>
        {isOpen ? (
          <FloatingPortal>
            <FloatingFocusManager context={context} modal={false}>
              <div
                ref={setFloating}
                className={`popover glass glass-thick ${
                  isEditor ? 'is-editor' : ''
                } ${className}`}
                style={floatingStyles}
                {...getFloatingProps({
                  'aria-label': label,
                })}
              >
                <ClosePopover value={() => setIsOpen(false)}>
                  {children}
                </ClosePopover>
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        ) : null}
      </FloatingNode>
    </>
  )
}

/**
 * Floating surface for dropdowns, color pickers and editors, opened and
 * closed by its trigger; `open` and `onOpenChange` let a parent steer it,
 * e.g. a select that closes after a choice. The `editor` variant opens
 * left of its trigger, keeps its alignment to it and only shifts as far
 * as the window needs, e.g. top-aligned beside a row. Nested popovers form
 * a tree, so a click inside a child, e.g. a color picker in an editor,
 * does not dismiss its parent.
 */
function Popover(props: PopoverProps) {
  const parentId = useFloatingParentNodeId()
  if (parentId) {
    return <PopoverNode {...props} />
  }
  return (
    <FloatingTree>
      <PopoverNode {...props} />
    </FloatingTree>
  )
}

export default Popover
