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
import { useLayoutEffect } from 'react'
import { X } from 'lucide-react'

import type { Placement, VirtualElement } from '@floating-ui/react'
import type { ReactNode, RefCallback } from 'react'

import IconButton from './IconButton'

type PopoverRole = 'dialog' | 'listbox'

type PopoverTriggerProps = {
  ref: RefCallback<HTMLButtonElement>
  'aria-expanded': boolean
  'aria-haspopup': PopoverRole
}

type PopoverProps = {
  anchor?: VirtualElement
  label: string
  open: boolean
  children: ReactNode
  className?: string
  placement?: Placement
  role?: PopoverRole
  matchTriggerWidth?: boolean
  onOpenChange: (open: boolean) => void
  renderTrigger?: (props: PopoverTriggerProps) => ReactNode
  title?: string
}

function PopoverNode({
  anchor,
  label,
  open,
  children,
  className = '',
  placement = 'bottom-end',
  role = 'dialog',
  title,
  matchTriggerWidth = false,
  onOpenChange,
  renderTrigger,
}: PopoverProps) {
  const nodeId = useFloatingNodeId()
  const {
    context,
    floatingStyles,
    refs: { setFloating, setPositionReference, setReference },
  } = useFloating<HTMLButtonElement>({
    nodeId,
    open,
    placement,
    strategy: 'fixed',
    onOpenChange,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({
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

  // An anchor positions the popover without its own trigger, e.g. next
  // to a chart.
  useLayoutEffect(() => {
    if (anchor) {
      setPositionReference(anchor)
    }
  }, [anchor, setPositionReference])

  const dismiss = useDismiss(context)
  const floatingRole = useRole(context, {
    role,
  })

  const { getFloatingProps } = useInteractions([dismiss, floatingRole])

  return (
    <>
      {renderTrigger?.({
        ref: setReference,
        'aria-expanded': open,
        'aria-haspopup': role,
      })}

      <FloatingNode id={nodeId}>
        {open ? (
          <FloatingPortal>
            <FloatingFocusManager context={context} modal={false}>
              <div
                ref={setFloating}
                className={className}
                style={floatingStyles}
                {...getFloatingProps({
                  'aria-label': label,
                })}
              >
                {title ? (
                  <header className="popover-header">
                    <h2 className="popover-title">{title}</h2>
                    <IconButton
                      label={`Close ${title}`}
                      size="xs"
                      variant="ghost"
                      onClick={() => onOpenChange(false)}
                    >
                      <X size={14} />
                    </IconButton>
                  </header>
                ) : null}
                {children}
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        ) : null}
      </FloatingNode>
    </>
  )
}

// Nested popovers form a tree, so a click inside a child (e.g. a color
// picker in a chart popover) does not dismiss its parent.
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
