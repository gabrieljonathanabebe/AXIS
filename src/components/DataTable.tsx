import DataTypeIcon from './DataTypeIcon'
import type { Dataset, DataValue } from "../types/chart";
import IconBadge from './ui/IconBadge';
import { useMemo } from "react";
import type { CSSProperties } from "react";

type DataTableProps = {
  dataset: Dataset
}

const categoryColors = [
  '#2f8cff', // blue
  '#22c55e', // green
  '#facc15', // yellow
  '#ef4444', // red
  '#a855f7', // purple
  '#14b8a6', // teal
]

function formatCellValue(value: DataValue) {
  if (value === null) {
    return ""
  }
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US").format(value)
  }
  return value
}

function getCategoryStyle(color: string): CSSProperties {
  return {
    "--category-color": color,
  } as CSSProperties
}

function DataTable({ dataset }: DataTableProps) {
  const minColumnWidth = 180
  const gridTemplateColumns = `repeat(${dataset.fields.length}, minmax(${minColumnWidth}px, 1fr))`
  const gridStyle: CSSProperties = {
    gridTemplateColumns,
    minWidth: `max(100%, ${dataset.fields.length * minColumnWidth}px)`,
  }
  const categoryColorMap = useMemo(() => {
    const colorMap = new Map<string, string>()
    dataset.fields
      .filter((field) => field.type === "category")
      .forEach((field) => {
        dataset.rows.forEach((row) => {
          const key = `${field.name}:${String(row[field.name] ?? "")}`

          if (!colorMap.has(key)) {
            colorMap.set(
              key,
              categoryColors[colorMap.size % categoryColors.length],
            )
          }
        })
      })
    return colorMap
  }, [dataset])
  return (
    <div className="data-table">
      <div className="data-table-scroll">
        <div
          className="data-table-header grid"
          style={gridStyle}
        >
          {dataset.fields.map((field) => (
            <button
              className="data-column-header spread"
              type="button"
              key={field.name}
              title={`Type: ${field.type}`}
            >
              <IconBadge label={field.name}>
                <DataTypeIcon type={field.type} />
              </IconBadge>
            </button>
          ))}
        </div>
        <div className="data-table-body">
          {dataset.rows.map((row, rowIndex) => (
            <div
              className="data-table-row grid"
              style={gridStyle}
              key={rowIndex}
            >
              {dataset.fields.map((field) => (
                <div className="data-table-cell" key={field.name}>
                  {field.type === "category" ? (
                    <span
                      className="data-category-badge inline-cluster"
                      style={getCategoryStyle(
                        categoryColorMap.get(`${field.name}:${String(row[field.name] ?? "")}`) ??
                        categoryColors[0],
                      )}
                    >
                      {formatCellValue(row[field.name])}
                    </span>
                  ) : (
                    formatCellValue(row[field.name])
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DataTable