import { Eye, EyeOff, Paintbrush } from 'lucide-react'
import { useEffect, useRef } from 'react'

import IconButton from './IconButton'
import Panel from './Panel'
import SelectControl from './SelectControl'

import type { ReactNode } from 'react'
import type { FormatVisibility } from './FormatWidget'

// ===== TYPES =================================================================
export type FormatElementOption<TElement extends string> = {
  label: string
  value: TElement
}

/** Select in the header that switches between the elements of an object. */
export type FormatElementSelect<TElement extends string> = {
  element: TElement
  options: FormatElementOption<TElement>[]
  onChange: (element: TElement) => void
}

type FormatPanelProps<TElement extends string> = {
  children: ReactNode
  elementSelect?: FormatElementSelect<TElement>
  isCollapsed: boolean
  label: string
  revealedGroup?: string | null
  visibility?: FormatVisibility
  onToggleCollapse: () => void
}

// ===== COMPONENT =============================================================
/**
 * Panel at the right of the canvas with the format groups of what is
 * selected: one element of an object or, without a selection, the
 * dashboard. The element select switches between the elements of the
 * same object; without it, the header shows the label. A visibility puts
 * an eye into the header that shows or hides the whole element, e.g. the
 * legend; while the element is hidden, only the header remains.
 * `revealedGroup` scrolls the group of a clicked part into view, e.g. the
 * data labels at the bottom of the marks.
 */
function FormatPanel<TElement extends string>({
  children,
  elementSelect,
  isCollapsed,
  label,
  revealedGroup,
  visibility,
  onToggleCollapse,
}: FormatPanelProps<TElement>) {
  const elementLabel =
    elementSelect?.options.find(
      (option) => option.value === elementSelect?.element,
    )?.label ?? label
  const visibilityAction = visibility?.visible ? 'Hide' : 'Show'
  const showsGroups = visibility?.visible ?? true
  const groupsRef = useRef<HTMLDivElement | null>(null)

  // Brings the group of a clicked part into view, e.g. the data labels.
  useEffect(() => {
    if (revealedGroup) {
      groupsRef.current
        ?.querySelector(`[data-format-group="${revealedGroup}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [revealedGroup])
  return (
    <Panel
      as="aside"
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
      className="format-panel"
      heading={
        <span className="format-panel-title cluster">
          <Paintbrush aria-hidden="true" size={16} />
          {elementSelect ? (
            <SelectControl
              label="Format element"
              options={elementSelect.options}
              value={elementSelect.element}
              variant="title"
              onChange={elementSelect.onChange}
            />
          ) : (
            label
          )}
        </span>
      }
      icon={<Paintbrush size={18} />}
      isCollapsed={isCollapsed}
      isEmbedded
      isScrollable
      side="end"
      title="Format panel"
      onToggleCollapse={onToggleCollapse}
    >
      {showsGroups ? (
        <div className="stack" ref={groupsRef}>
          {children}
        </div>
      ) : null}
    </Panel>
  )
}

export default FormatPanel
