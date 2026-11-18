import type { DataField } from '../datasets/types'
import type { TimeGrain } from '../shared/format/valueFormats'
import type { ChartDataSpec } from './types'

/**
 * Whether a field holds dates; decided by the physical type, since only
 * dates can be truncated, whatever role the field has.
 * @param field Field of the dataset.
 * @returns True for date and datetime fields.
 */
export function isDateField(field: DataField): boolean {
  return field.physical_type === 'date' || field.physical_type === 'datetime'
}

/**
 * Time grain the chart groups its X dates by: the chosen grain, else the
 * native grain of the X field, else days.
 * @param data Data spec of the chart.
 * @param fields Fields of the dataset.
 * @returns The grain, or null if X holds no dates or the chart shows
 * single rows instead of groups.
 */
export function getEffectiveTimeGrain(
  data: ChartDataSpec,
  fields: DataField[],
): TimeGrain | null {
  if (data.aggregation === 'none') {
    return null
  }
  const xField = fields.find((field) => field.name === data.encoding.x)
  if (!xField || !isDateField(xField)) {
    return null
  }
  return data.timeGrain ?? xField.native_grain ?? 'day'
}
