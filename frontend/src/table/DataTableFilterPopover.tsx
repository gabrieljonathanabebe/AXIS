import { ListFilter } from 'lucide-react'
import { useState } from 'react'

import Button from '../shared/ui/Button'
import IconButton from '../shared/ui/IconButton'
import Popover from '../shared/ui/Popover'
import DataTableFilterForm from './DataTableFilterForm'

import type { DataTableFilterFormProps } from './DataTableFilterForm'

// ===== COMPONENT =============================================================
/** Filter button of a column header that opens the column's filter form. */
function DataTableFilterPopover(props: DataTableFilterFormProps) {
  const { fieldName, filter, onFilterChange } = props
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover
      label={`Filter ${fieldName}`}
      open={isOpen}
      className="data-filter-popover glass glass-thick stack"
      placement="bottom-start"
      onOpenChange={setIsOpen}
      renderTrigger={(triggerProps) => (
        <IconButton
          {...triggerProps}
          className="data-column-filter"
          isActive={filter !== null}
          label={`Filter ${fieldName}`}
          size="xs"
          variant="ghost"
          onClick={() => {
            setIsOpen((current) => !current)
          }}
        >
          <ListFilter size={12} />
        </IconButton>
      )}
    >
      <span className="data-filter-title">{fieldName}</span>
      <DataTableFilterForm {...props} />
      {filter ? (
        <Button
          className="data-filter-clear"
          onClick={() => {
            onFilterChange(null)
            setIsOpen(false)
          }}
        >
          Clear filter
        </Button>
      ) : null}
    </Popover>
  )
}

export default DataTableFilterPopover
