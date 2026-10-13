import AxisWidget from './appearance/AxisWidget'
import ChartTitleWidget from './appearance/ChartTitleWidget'
import ControlRow from '../shared/ui/ControlRow'
import LegendWidget from './appearance/LegendWidget'
import Popover from '../shared/ui/Popover'
import SelectControl from '../shared/ui/SelectControl'
import {
  getDefaultAxisTitle,
  getDefaultChartTitle,
} from '../charts/getChartTitle'
import { getFormatElements } from '../charts/getFormatElements'

import type { ReactNode } from 'react'
import type { ChartFormatElement } from '../charts/types'
import type { ChartInspectorProps } from './types'
import type { FormatTarget } from '../objects/types'

// ===== TYPES =================================================================
type ChartFormatPopoverProps = ChartInspectorProps & {
  target: FormatTarget
  onClose: () => void
  onElementChange: (element: ChartFormatElement) => void
}

// ===== CONSTANTS =============================================================
const elementTitles: Record<ChartFormatElement, string> = {
  legend: 'Legend',
  title: 'Title',
  xAxis: 'X Axis',
  yAxis: 'Y Axis',
}

// ===== HELPERS ===============================================================
/**
 * Selects where presses keep the popover open: the canvas toolbar (undo,
 * redo, the format toggle) and the formatted object, whose regions switch
 * the element.
 */
function getKeepOpenSelector(objectId: string): string {
  return `.canvas-toolbar, [data-object-id="${objectId}"]`
}

function renderFormatWidget(
  element: ChartFormatElement,
  { actions, chart, fields }: ChartInspectorProps,
): ReactNode {
  const { appearance } = chart.spec
  switch (element) {
    case 'legend':
      return (
        <LegendWidget
          value={appearance.legend}
          variant="bare"
          onChange={(value) => actions.setAppearance('legend', value)}
        />
      )
    case 'title':
      return (
        <ChartTitleWidget
          defaultTitle={getDefaultChartTitle(chart, fields)}
          value={appearance.title}
          variant="bare"
          onChange={(value) => actions.setAppearance('title', value)}
        />
      )
    case 'xAxis':
    case 'yAxis': {
      const axis = element === 'xAxis' ? 'x' : 'y'
      return (
        <AxisWidget
          defaultTitle={getDefaultAxisTitle(chart, fields, axis)}
          orientation={axis}
          value={appearance[element]}
          variant="bare"
          onChange={(value) => actions.setAppearance(element, value)}
        />
      )
    }
  }
}

// ===== FUNCTION ==============================================================
/**
 * Shows the format widget of one chart element next to the chart.
 * The element select switches between the elements of the same chart.
 */
function ChartFormatPopover({
  target,
  onClose,
  onElementChange,
  ...inspectorProps
}: ChartFormatPopoverProps) {
  const { chart, fields } = inspectorProps
  const elementOptions = getFormatElements(chart, fields).map((element) => ({
    label: elementTitles[element],
    value: element,
  }))
  return (
    <Popover
      anchor={target.anchor}
      className="chart-format-popover glass glass-thick"
      keepOpenOn={getKeepOpenSelector(target.objectId)}
      label="Chart format"
      open
      placement="right-start"
      title="Format"
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <div className="stack">
        <ControlRow label="Element">
          <SelectControl
            label="Format element"
            options={elementOptions}
            value={target.element}
            onChange={onElementChange}
          />
        </ControlRow>
        {renderFormatWidget(target.element, inspectorProps)}
      </div>
    </Popover>
  )
}

export default ChartFormatPopover
