import {
  ChevronRight,
  Grid2X2,
  List,
  MousePointerClick,
  MoveHorizontal,
  MoveVertical,
  Shapes,
  Tags,
  ZoomIn,
} from 'lucide-react'

import ContainerWidget from '../../objects/ContainerWidget'
import ObjectFormatPopover from '../../objects/ObjectFormatPopover'
import ObjectTitleWidget from '../../objects/ObjectTitleWidget'
import Button from '../../shared/ui/Button'
import ControlRow from '../../shared/ui/ControlRow'
import { isRadialChartType } from '../chartDefinitions'
import { getDefaultAxisTitle, getDefaultChartTitle } from '../getChartTitle'
import { getFormatElements } from '../getFormatElements'
import AxisWidget from './AxisWidget'
import ColorScaleWidget from './ColorScaleWidget'
import GridWidget from './GridWidget'
import LabelsWidget from './LabelsWidget'
import LegendInteractionWidget from './LegendInteractionWidget'
import LegendWidget from './LegendWidget'
import MarkSeriesWidget from './MarkSeriesWidget'
import TooltipWidget from './TooltipWidget'
import ZoomWidget from './ZoomWidget'

import type { FormatSection } from '../../objects/ObjectFormatPopover'
import type { FormatTarget } from '../../objects/types'
import type { ChartFormatElement, ChartFormatProps } from '../types'

// ===== TYPES =================================================================
type ChartFormatPopoverProps = ChartFormatProps & {
  element: ChartFormatElement
  target: FormatTarget
  onClose: () => void
  onElementChange: (element: ChartFormatElement) => void
}

// ===== CONSTANTS =============================================================
const elementTitles: Record<ChartFormatElement, string> = {
  colorScale: 'Color Scale',
  container: 'Chart',
  legend: 'Legend',
  marks: 'Marks',
  title: 'Title',
  tooltip: 'Tooltip',
  xAxis: 'X Axis',
  xAxisLabels: 'X Axis Labels',
  yAxis: 'Y Axis',
  yAxisLabels: 'Y Axis Labels',
}

// ===== HELPERS ===============================================================
/**
 * Lists the sections of one chart element; each shows its widget bare.
 * Several sections switch by a segmented control in the popover.
 * @param element Element selected in the popover.
 * @param formatProps Actions, chart and fields of the chart.
 * @param onElementChange Switches the popover to another element, e.g. from
 *   the marks to their tooltip.
 * @returns The sections, each wired to its chart action.
 */
function getFormatSections(
  element: ChartFormatElement,
  { actions, chart, fields }: ChartFormatProps,
  onElementChange: (element: ChartFormatElement) => void,
): FormatSection[] {
  const { appearance, interaction } = chart.spec
  switch (element) {
    case 'colorScale':
      return [
        {
          content: (
            <ColorScaleWidget
              value={appearance.colorScale.continuous}
              onChange={(continuous) =>
                actions.setAppearance('colorScale', {
                  ...appearance.colorScale,
                  continuous,
                })
              }
            />
          ),
          label: 'Color Scale',
        },
      ]
    case 'container':
      return [
        {
          content: (
            <ContainerWidget
              value={chart.container}
              onChange={actions.setContainer}
            />
          ),
          label: 'Chart',
        },
      ]
    case 'legend':
      return [
        {
          content: (
            <LegendWidget
              value={appearance.legend}
              onChange={(value) => actions.setAppearance('legend', value)}
            />
          ),
          icon: List,
          label: 'Legend',
        },
        {
          content: (
            <LegendInteractionWidget
              value={interaction.legend}
              onChange={(value) => actions.setInteraction('legend', value)}
            />
          ),
          icon: MousePointerClick,
          label: 'Interaction',
        },
      ]
    case 'marks':
      return [
        {
          content: (
            <>
              <MarkSeriesWidget
                actions={actions}
                chart={chart}
                fields={fields}
              />
              <ControlRow label="Tooltip">
                <Button
                  size="sm"
                  variant="accent"
                  onClick={() => onElementChange('tooltip')}
                >
                  Edit
                  <ChevronRight aria-hidden="true" size={14} />
                </Button>
              </ControlRow>
            </>
          ),
          icon: Shapes,
          label: 'Marks',
        },
        {
          content: (
            <LabelsWidget
              isRadial={isRadialChartType(chart.type)}
              value={appearance.labels}
              onChange={(value) => actions.setAppearance('labels', value)}
            />
          ),
          icon: Tags,
          label: 'Labels',
        },
      ]
    case 'title':
      return [
        {
          content: (
            <ObjectTitleWidget
              defaultTitle={getDefaultChartTitle(chart, fields)}
              value={appearance.title}
              onChange={(value) => actions.setAppearance('title', value)}
            />
          ),
          label: 'Title',
        },
      ]
    case 'tooltip':
      return [
        {
          content: (
            <TooltipWidget
              showTrigger={!isRadialChartType(chart.type)}
              value={interaction.tooltip}
              onChange={(value) => actions.setInteraction('tooltip', value)}
            />
          ),
          label: 'Tooltip',
        },
      ]
    case 'xAxis':
    case 'xAxisLabels':
    case 'yAxis':
    case 'yAxisLabels': {
      const axis = element.startsWith('x') ? 'x' : 'y'
      const axisElement = `${axis}Axis` as const
      const axisAppearance = appearance[axisElement]
      const isAxisTitle = element === axisElement
      const sections: FormatSection[] = [
        {
          content: (
            <AxisWidget
              defaultTitle={getDefaultAxisTitle(chart, fields, axis)}
              orientation={axis}
              part={isAxisTitle ? 'title' : 'labels'}
              value={axisAppearance}
              onChange={(value) => actions.setAppearance(axisElement, value)}
            />
          ),
          icon: axis === 'x' ? MoveHorizontal : MoveVertical,
          label: 'Axis',
        },
      ]
      if (isAxisTitle) {
        sections.push({
          content: (
            <GridWidget
              value={axisAppearance.gridLines}
              onChange={(gridLines) =>
                actions.setAppearance(axisElement, {
                  ...axisAppearance,
                  gridLines,
                })
              }
            />
          ),
          icon: Grid2X2,
          label: 'Gridlines',
        })
      }
      if (isAxisTitle && axis === 'x') {
        sections.push({
          content: (
            <ZoomWidget
              value={interaction.zoom}
              onChange={(value) => actions.setInteraction('zoom', value)}
            />
          ),
          icon: ZoomIn,
          label: 'Zoom',
        })
      }
      return sections
    }
  }
}

// ===== FUNCTION ==============================================================
/**
 * Shows the format sections of one chart element next to the chart.
 * The element select switches between the elements of the same chart.
 */
function ChartFormatPopover({
  element,
  target,
  onClose,
  onElementChange,
  ...formatProps
}: ChartFormatPopoverProps) {
  const { chart, fields } = formatProps
  const elementOptions = getFormatElements(chart, fields).map((element) => ({
    label: elementTitles[element],
    value: element,
  }))
  return (
    <ObjectFormatPopover
      element={element}
      elementOptions={elementOptions}
      label="Chart format"
      sections={getFormatSections(element, formatProps, onElementChange)}
      target={target}
      onClose={onClose}
      onElementChange={onElementChange}
    />
  )
}

export default ChartFormatPopover
