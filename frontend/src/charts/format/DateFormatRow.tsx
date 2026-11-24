import {
  createDateFormatter,
  resolveDatePreset,
} from '@/shared/format/formatDate'
import { DATE_PRESETS_BY_GRAIN } from '@/shared/format/valueFormats'
import SelectControl from '@/shared/ui/controls/SelectControl'
import Row from '@/shared/ui/rows/Row'

import type {
  DateFormat,
  DatePreset,
  TimeGrain,
} from '@/shared/format/valueFormats'
import type { OptionItem } from '@/shared/ui/primitives/OptionsMenu'

// ===== TYPES =================================================================
type DateFormatRowProps = {
  /** Time grain of the dates; only its presets are offered. */
  grain: TimeGrain | null
  /** Name of the element in the control labels, e.g. "X Axis". */
  label: string
  value: DateFormat
  onChange: (value: DateFormat) => void
}

/** Choice of the select; auto follows the grain. */
type DateFormatChoice = DatePreset | 'auto'

// ===== CONSTANTS =============================================================
/** Example of the options; a day over 12 keeps day and month apart. */
const EXAMPLE_DATE = '2025-03-14'

/** Example of week presets: the Monday of the example's week. */
const EXAMPLE_WEEK_START = '2025-03-10'

// ===== COMPONENT =============================================================
/**
 * Wide select of a date format: Auto with what it shows, then the presets
 * of the grain, each as an example; a stored preset that does not fit the
 * grain shows as Auto, like the chart draws it.
 */
function DateFormatRow({ grain, label, value, onChange }: DateFormatRowProps) {
  const activeGrain = grain ?? 'day'
  const example = activeGrain === 'week' ? EXAMPLE_WEEK_START : EXAMPLE_DATE
  const presets = DATE_PRESETS_BY_GRAIN[activeGrain]

  /** Example of a preset, e.g. "Mar 2025". */
  function formatExample(preset: DatePreset): string {
    return createDateFormatter(
      { preset, style: 'preset' },
      activeGrain,
    )(example)
  }

  const options: OptionItem<DateFormatChoice>[] = [
    { label: `Auto · ${formatExample(presets[0])}`, value: 'auto' },
    ...presets.map((preset) => ({
      label: formatExample(preset),
      value: preset,
    })),
  ]
  const choice: DateFormatChoice =
    value.style === 'preset' && resolveDatePreset(value, grain) === value.preset
      ? value.preset
      : 'auto'

  return (
    <Row layout="wide">
      <SelectControl
        label={`${label} date format`}
        options={options}
        value={choice}
        onChange={(next) => {
          onChange(
            next === 'auto'
              ? { style: 'auto' }
              : { preset: next, style: 'preset' },
          )
        }}
      />
    </Row>
  )
}

export default DateFormatRow
