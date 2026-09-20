import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  shift,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react'

import type { Placement } from '@floating-ui/react'
import type { ReactNode, RefCallback } from 'react'

type PopoverRole = 'dialog' | 'listbox'

type PopoverTriggerProps = {
  ref: RefCallback<HTMLButtonElement>
  'aria-expanded': boolean
  'aria-haspopup': PopoverRole
}

type PopoverProps = {
  label: string
  open: boolean
  children: ReactNode
  className?: string
  placement?: Placement
  role?: PopoverRole
  matchTriggerWidth?: boolean
  onOpenChange: (open: boolean) => void
  renderTrigger: (props: PopoverTriggerProps) => ReactNode
}

function Popover({
  label,
  open,
  children,
  className = '',
  placement = 'bottom-end',
  role = 'dialog',
  matchTriggerWidth = false,
  onOpenChange,
  renderTrigger,
}: PopoverProps) {
  const { refs, floatingStyles, context } = useFloating<HTMLButtonElement>({
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
        padding: 12,
      }),
      matchTriggerWidth
        ? size({
            padding: 12,
            apply({ rects, elements }) {
              elements.floating.style.width = `${rects.reference.width}px`
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
        ref: refs.setReference,
        'aria-expanded': open,
        'aria-haspopup': role,
      })}

      {open ? (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              className={className}
              style={floatingStyles}
              {...getFloatingProps({
                'aria-label': label,
              })}
            >
              {children}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </>
  )
}

export default Popover
