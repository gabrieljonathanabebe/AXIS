import { X } from 'lucide-react'
import { use } from 'react'

import { InsideGroup } from '../groups/groupContext'
import IconButton from '../primitives/IconButton'
import { ClosePopover } from '../primitives/popoverContext'

import type { ReactNode } from 'react'

// ===== TYPES =================================================================
type EditorProps = {
  children: ReactNode
  title?: string
}

// ===== COMPONENT =============================================================
/**
 * Content of a popover: its rows and groups with the spacing of the
 * format panel. A `title` adds a header with a close button, e.g. the
 * color range of a scale; without, the rows say what it edits, e.g. the
 * editor of a paint. Groups inside start at the top level again, also
 * when the trigger stands in a group.
 * @param props Rows and groups, optional title.
 */
function Editor({ children, title }: EditorProps) {
  const close = use(ClosePopover)
  return (
    <>
      {title ? (
        <header className="editor-header">
          <h2 className="editor-title">{title}</h2>
          <IconButton
            label={`Close ${title.toLowerCase()}`}
            size="xs"
            variant="ghost"
            onClick={close}
          >
            <X size={14} />
          </IconButton>
        </header>
      ) : null}
      <InsideGroup value={false}>
        <div className="editor-body stack">{children}</div>
      </InsideGroup>
    </>
  )
}

export default Editor
