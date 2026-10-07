import { ListFilter, Search } from 'lucide-react'
import { useState } from 'react'

import { formatDate } from '../../data/formatDate'
import { formatNumber } from '../../data/formatNumber'
import { createMeasureSteps } from '../../data/measureSteps'
import { createTemporalSteps } from '../../data/temporalSteps'
import { useFieldValues } from '../../hooks/useFieldValues'
import Button from '../ui/Button'
import CheckList from '../ui/CheckList'
import IconButton from '../ui/IconButton'
import Popover from '../ui/Popover'
import RangeSlider from '../ui/RangeSlider'
import TextInput from '../ui/TextInput'

import type { TableFilter } from '../../api/tableQuery'
import type {
  FieldProfile,
  FieldStatistics,
  SemanticRole,
} from '../../types/chart'
import type { CheckListOption } from '../ui/CheckList'

// ===== TYPES =================================================================
type DataTableFilterPopoverProps = {
  datasetId: string | null
  fieldName: string
  filter: TableFilter | null
  profileField: FieldProfile | null
  semanticRole: SemanticRole | null
  onFilterChange: (filter: TableFilter | null) => void
}

type FilterFormProps = Omit<DataTableFilterPopoverProps, 'semanticRole'>

type StepRangeProps<TStep extends number | string> = {
  end: TStep | null
  label: string
  start: TStep | null
  steps: TStep[]
  formatStep: (step: TStep) => string
  onRangeChange: (start: TStep | null, end: TStep | null) => void
}

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

function getStepIndex<TStep>(
  steps: TStep[],
  step: TStep | null,
  fallback: number,
): number {
  const index = step === null ? -1 : steps.indexOf(step)
  return index === -1 ? fallback : index
}

// ===== FORMS =================================================================
// A thumb at the first or last step leaves that side open; the full range
// is no filter.
function StepRange<TStep extends number | string>({
  end,
  label,
  start,
  steps,
  formatStep,
  onRangeChange,
}: StepRangeProps<TStep>) {
  const lastIndex = steps.length - 1
  if (lastIndex === 0) {
    return <span className="data-filter-note">All rows share one value.</span>
  }
  return (
    <RangeSlider
      label={label}
      max={lastIndex}
      min={0}
      value={[
        getStepIndex(steps, start, 0),
        getStepIndex(steps, end, lastIndex),
      ]}
      formatValue={(index) => formatStep(steps[index])}
      onValueChange={([startIndex, endIndex]) => {
        onRangeChange(
          startIndex > 0 ? steps[startIndex] : null,
          endIndex < lastIndex ? steps[endIndex] : null,
        )
      }}
    />
  )
}

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

  return (
    <StepRange
      end={range?.max ?? null}
      label={`${fieldName} range`}
      start={range?.min ?? null}
      steps={createMeasureSteps(
        statistics.min,
        statistics.max,
        profileField?.physical_type === 'integer',
      )}
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

// Steps follow the profile's range and detected granularity.
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

  return (
    <StepRange
      end={dateRange?.end ?? null}
      label={`${fieldName} range`}
      start={dateRange?.start ?? null}
      steps={createTemporalSteps(
        statistics.min,
        statistics.max,
        statistics.granularity,
      )}
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

// Selection stays when the search hides a checked value.
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
      <TextInput
        icon={<Search size={14} />}
        label={`Search ${fieldName} values`}
        placeholder="Search values"
        value={search}
        onValueChange={setSearch}
      />
      <CheckList
        label={`${fieldName} values`}
        options={options}
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

// One control per role; ranges need profile statistics, else values.
function FilterForm({
  semanticRole,
  ...formProps
}: DataTableFilterPopoverProps) {
  const { profileField } = formProps
  if (semanticRole === 'measure' && getStatistics(profileField, 'measure')) {
    return <MeasureRangeFilterForm {...formProps} />
  }
  if (semanticRole === 'temporal' && getStatistics(profileField, 'temporal')) {
    return <DateRangeFilterForm {...formProps} />
  }
  return <ValuesFilterForm {...formProps} />
}

// ===== COMPONENT =============================================================
function DataTableFilterPopover(props: DataTableFilterPopoverProps) {
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
      <FilterForm {...props} />
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
