import AxisWidget from './appearance/AxisWidget'
import ChartTitleWidget from './appearance/ChartTitleWidget'
import LegendWidget from './appearance/LegendWidget'
import ObjectFormatPopover from '../objects/ObjectFormatPopover'
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
  element: ChartFormatElement
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
  element,
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
    <ObjectFormatPopover
      element={element}
      elementOptions={elementOptions}
      label="Chart format"
      target={target}
      onClose={onClose}
      onElementChange={onElementChange}
    >
      {renderFormatWidget(element, inspectorProps)}
    </ObjectFormatPopover>
  )
}

export default ChartFormatPopover
