import { formatNumber } from '../shared/format/formatNumber'

import type { Ref } from 'react'
import type { DataRow } from '../datasets/types'
import type { DataTableColumn } from './types'

// ===== TYPES =================================================================
type DataTableRowProps = {
  columns: DataTableColumn[]
  index: number
  ref: Ref<HTMLTableRowElement>
  row: DataRow
}

// ===== HELPERS ===============================================================
function formatCellValue(value: number | string): string {
  return typeof value === 'number' ? formatNumber(value) : value
}

// ===== COMPONENT =============================================================
/** One table row with its row number; missing values show a dash. */
function DataTableRow({ columns, index, ref, row }: DataTableRowProps) {
  return (
    <tr data-index={index} ref={ref}>
      <td className="data-table-index">{index + 1}</td>
      {columns.map(({ field, semanticRole }) => {
        const value = row[field.name]
        return (
          <td
            className={semanticRole === 'measure' ? 'is-numeric' : ''}
            key={field.name}
          >
            {value === null ? (
              <span className="data-table-missing">—</span>
            ) : (
              formatCellValue(value)
            )}
          </td>
        )
      })}
    </tr>
  )
}

export default DataTableRow
