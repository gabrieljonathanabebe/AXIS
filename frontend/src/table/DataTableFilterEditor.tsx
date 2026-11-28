import { useState } from 'react'

import { formatDate } from '@/shared/format/formatDate'
import { formatNumber } from '@/shared/format/formatNumber'
import CheckList from '@/shared/ui/controls/CheckList'
import RangeControl from '@/shared/ui/controls/RangeControl'
import { createMeasureSteps } from './measureSteps'
import { createTemporalSteps } from './temporalSteps'
import { useFieldValues } from './useFieldValues'

import type {
  FieldProfile,
  FieldStatistics,
  SemanticRole,
} from '@/datasets/types'
import type { CheckListOption } from '@/shared/ui/controls/CheckList'
import type { TableFilter } from './tableApi'

// ===== TYPES =================================================================
export type DataTableFilterEditorProps = {
  datasetId: string | null
  fieldName: string
  filter: TableFilter | null
  profileField: FieldProfile | null
  semanticRole: SemanticRole | null
  onFilterChange: (filter: TableFilter | null) => void
}

type FilterFormProps = Omit<DataTableFilterEditorProps, 'semanticRole'>

// ===== HELPERS ===============================================================
function createValuesFilter(
  field: string,
  values: string[],
): TableFilter | null {
  return values.length > 0 ? { field, kind: 'values', values } : null
}

function getStatistics<TKind extends FieldStatistics['kind']>(
  profileField: FieldProfile | null,
  kind: TKind,
): Extract<FieldStatistics, { kind: TKind }> | null {
  const statistics = profileField?.statistics
  return statistics?.kind === kind
    ? (statistics as Extract<FieldStatistics, { kind: TKind }>)
    : null
}

// ===== FORMS =================================================================
/** Note when every row has the same value, so a range has nothing to pick. */
const ONE_VALUE_NOTE = (
  <span className="data-filter-note">All rows share one value.</span>
)

/**
 * Range of a number field over evenly spaced steps between its minimum and
 * maximum; a full range is no filter.
 * @param props Field, its profile and the current filter.
 */
function MeasureRangeFilterForm({
  fieldName,
  filter,
  profileField,
  onFilterChange,
}: FilterFormProps) {
  const statistics = getStatistics(profileField, 'measure')
  if (statistics?.min == null || statistics.max == null) {
    return <span className="data-filter-note">No value range available.</span>
  }
  const range = filter?.kind === 'range' ? filter : null
  const steps = createMeasureSteps(
    statistics.min,
    statistics.max,
    profileField?.physical_type === 'integer',
  )
  if (steps.length < 2) {
    return ONE_VALUE_NOTE
  }

  return (
    <RangeControl
      end={range?.max ?? null}
      label={`${fieldName} range`}
      start={range?.min ?? null}
      steps={steps}
      formatStep={formatNumber}
      onRangeChange={(min, max) => {
        onFilterChange(
          min === null && max === null
            ? null
            : { field: fieldName, kind: 'range', max, min },
        )
      }}
    />
  )
}

/**
 * Range of a date field; the steps follow the range of its profile and the
 * native grain of the field, e.g. days or months.
 * @param props Field, its profile and the current filter.
 */
function DateRangeFilterForm({
  fieldName,
  filter,
  profileField,
  onFilterChange,
}: FilterFormProps) {
  const statistics = getStatistics(profileField, 'temporal')
  if (!statistics?.min || !statistics.max) {
    return <span className="data-filter-note">No date range available.</span>
  }
  const dateRange = filter?.kind === 'date_range' ? filter : null
  const steps = createTemporalSteps(
    statistics.min,
    statistics.max,
    profileField?.native_grain ?? null,
  )
  if (steps.length < 2) {
    return ONE_VALUE_NOTE
  }

  return (
    <RangeControl
      end={dateRange?.end ?? null}
      label={`${fieldName} range`}
      start={dateRange?.start ?? null}
      steps={steps}
      formatStep={formatDate}
      onRangeChange={(start, end) => {
        onFilterChange(
          start === null && end === null
            ? null
            : { end, field: fieldName, kind: 'date_range', start },
        )
      }}
    />
  )
}

/**
 * Values of a field to check, found by a search on the server; checked
 * values stay checked when the search hides them.
 * @param props Dataset, field and the current filter.
 */
function ValuesFilterForm({
  datasetId,
  fieldName,
  filter,
  onFilterChange,
}: FilterFormProps) {
  const [search, setSearch] = useState('')
  const { error, result } = useFieldValues(datasetId, fieldName, search)
  const selectedValues = filter?.kind === 'values' ? filter.values : []
  const options: CheckListOption[] = (result?.values ?? []).map(
    ({ count, value }) => ({
      detail: formatNumber(count),
      label: value,
      value,
    }),
  )
  const hiddenCount = result ? result.total_count - result.values.length : 0

  return (
    <>
      <CheckList
        label={`${fieldName} values`}
        options={options}
        search={{
          placeholder: 'Search values',
          value: search,
          onValueChange: setSearch,
        }}
        values={selectedValues}
        onValuesChange={(values) => {
          onFilterChange(createValuesFilter(fieldName, values))
        }}
      />
      {error ? <span className="data-filter-note">{error}</span> : null}
      {result?.total_count === 0 ? (
        <span className="data-filter-note">No values found.</span>
      ) : null}
      {hiddenCount > 0 ? (
        <span className="data-filter-note">
          {formatNumber(hiddenCount)} more values – refine the search.
        </span>
      ) : null}
    </>
  )
}

// ===== COMPONENT =============================================================
/** One control per role; ranges need profile statistics, else values. */
function DataTableFilterEditor({
  semanticRole,
  ...formProps
}: DataTableFilterEditorProps) {
  const { profileField } = formProps
  if (semanticRole === 'measure' && getStatistics(profileField, 'measure')) {
    return <MeasureRangeFilterForm {...formProps} />
  }
  if (semanticRole === 'temporal' && getStatistics(profileField, 'temporal')) {
    return <DateRangeFilterForm {...formProps} />
  }
  return <ValuesFilterForm {...formProps} />
}

export default DataTableFilterEditor
