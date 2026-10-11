import AxisWidget from './appearance/AxisWidget'
import Popover from '../shared/ui/Popover'
import { getDefaultAxisTitle } from '../charts/getChartTitle'

import type { ChartFormatElement } from '../charts/types'
import type { ChartFormatTarget, ChartInspectorProps } from './types'

// ===== TYPES =================================================================
type ChartFormatPopoverProps = ChartInspectorProps & {
  target: ChartFormatTarget
  onClose: () => void
}

// ===== CONSTANTS =============================================================
const elementTitles: Record<ChartFormatElement, string> = {
  xAxis: 'X Axis',
  yAxis: 'Y Axis',
}

// ===== FUNCTION ==============================================================
/** Shows the inspector widget of one chart element next to the chart. */
function ChartFormatPopover({
  actions,
  chart,
  fields,
  target,
  onClose,
}: ChartFormatPopoverProps) {
  const { element } = target
  const title = elementTitles[element]
  const axis = element === 'xAxis' ? 'x' : 'y'
  return (
    <Popover
      anchor={target.anchor}
      className="chart-format-popover glass glass-thick"
      label={`${title} format`}
      open
      placement="right-start"
      title={title}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <AxisWidget
        defaultTitle={getDefaultAxisTitle(chart, fields, axis)}
        orientation={axis}
        value={chart.spec.appearance[element]}
        variant="bare"
        onChange={(value) => actions.setAppearance(element, value)}
      />
    </Popover>
  )
}

export default ChartFormatPopover
