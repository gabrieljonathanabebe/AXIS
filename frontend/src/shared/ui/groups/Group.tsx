import { ChevronDown, Eye, EyeOff, Plus } from 'lucide-react'
import { use, useEffect, useId, useRef, useState } from 'react'

import IconButton from '../primitives/IconButton'
import { InsideGroup } from './groupContext'

import type { ReactNode } from 'react'

// ===== TYPES =================================================================
/** Shows or hides a group or a whole element, e.g. by its eye. */
export type FormatVisibility = {
  visible: boolean
  onChange: (visible: boolean) => void
}

type GroupProps = {
  children?: ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
  forceOpen?: boolean
  group?: string
  icon?: ReactNode
  meta?: ReactNode
  title?: string
  visibility?: FormatVisibility
  onAdd?: () => void
}

// ===== COMPONENT =============================================================
/**
 * One group of rows, e.g. in the format panel. The title becomes a small
 * heading, with an optional icon before it and `meta` after it, e.g. the
 * number of fields; a visibility becomes an eye on its right, which also
 * shows or hides the rows, and `onAdd` a plus that adds what the rows edit,
 * e.g. an effect. `collapsible` adds a chevron, and the title opens and
 * closes the rows too; they start open unless `defaultOpen` is false, and
 * `forceOpen` keeps them open, e.g. while searching fields. These icons
 * stand in the icon column of the rows below.
 * `group` names the part of the object the group formats when it differs
 * from the element of the panel, e.g. the data labels within the marks; a
 * group inside a group is a subgroup with a quieter heading, at most two
 * levels; an editor starts at the top level again. Without a title the
 * rows stand alone, e.g. the encodings in the chart data of the build
 * panel.
 * @param props Rows, optional title, icon, meta, part, visibility, add
 *   action and collapsing.
 */
function Group({
  children,
  collapsible = false,
  defaultOpen = true,
  forceOpen = false,
  group,
  icon,
  meta,
  title,
  visibility,
  onAdd,
}: GroupProps) {
  const visibilityAction = visibility?.visible ? 'Hide' : 'Show'
  const isSubgroup = use(InsideGroup)
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentId = useId()
  const isExpanded = !collapsible || forceOpen || isOpen
  const showsRows = (visibility?.visible ?? true) && isExpanded
  const groupRef = useRef<HTMLDivElement | null>(null)
  const revealsAdded = useRef(false)

  useEffect(() => {
    if (revealsAdded.current) {
      revealsAdded.current = false
      groupRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  })

  /**
   * Adds what the rows edit and scrolls the group into view once the new
   * row is rendered, e.g. an effect at the bottom of the popover.
   */
  function handleAdd(): void {
    revealsAdded.current = true
    onAdd?.()
  }

  /** Opens or closes the rows of a collapsible group. */
  function toggleOpen(): void {
    setIsOpen((open) => !open)
  }

  const heading = (
    <>
      {icon}
      {title}
      {meta === undefined ? null : <span className="group-meta">{meta}</span>}
    </>
  )

  return (
    <div
      className={`group stack ${isSubgroup ? 'is-subgroup' : ''}`}
      data-format-group={group}
      ref={groupRef}
    >
      {title ? (
        <div className="group-header">
          {collapsible ? (
            <button
              className="group-title group-toggle"
              type="button"
              aria-controls={contentId}
              aria-expanded={isExpanded}
              onClick={toggleOpen}
            >
              {heading}
            </button>
          ) : (
            <span className="group-title">{heading}</span>
          )}
          <span className="cluster">
            {visibility ? (
              <IconButton
                label={`${visibilityAction} ${title.toLowerCase()}`}
                size="xs"
                variant="ghost"
                onClick={() => visibility.onChange(!visibility.visible)}
              >
                {visibility.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </IconButton>
            ) : null}
            {onAdd ? (
              <IconButton
                label={`Add ${title.toLowerCase()}`}
                size="xs"
                variant="ghost"
                onClick={handleAdd}
              >
                <Plus size={14} />
              </IconButton>
            ) : null}
            {collapsible ? (
              <IconButton
                label={`${isExpanded ? 'Collapse' : 'Expand'} ${title.toLowerCase()}`}
                size="xs"
                variant="ghost"
                aria-controls={contentId}
                aria-expanded={isExpanded}
                onClick={toggleOpen}
              >
                <ChevronDown
                  className={`group-chevron ${isExpanded ? 'is-open' : ''}`}
                  size={14}
                />
              </IconButton>
            ) : null}
          </span>
        </div>
      ) : null}
      {showsRows && children ? (
        <div className="group-content stack" id={contentId}>
          <InsideGroup value={true}>{children}</InsideGroup>
        </div>
      ) : null}
    </div>
  )
}

export default Group
