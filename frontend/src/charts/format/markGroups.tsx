import { Circle, Diamond, Square, Triangle } from 'lucide-react'

import ColorField from '../../shared/ui/ColorField'
import { DATA_COLOR_PRESETS } from '../../shared/ui/colorPresets'
import ControlRow from '../../shared/ui/ControlRow'
import EffectControls from '../../shared/ui/EffectControls'
import FillControls from '../../shared/ui/FillControls'
import FormatWidget from '../../shared/ui/FormatWidget'
import GradientControl from '../../shared/ui/GradientControl'
import PaletteControl from '../../shared/ui/PaletteControl'
import RangeSlider from '../../shared/ui/RangeSlider'
import SegmentedControl from '../../shared/ui/SegmentedControl'
import Slider from '../../shared/ui/Slider'
import StrokeStyleControls from '../../shared/ui/StrokeStyleControls'
import Toggle from '../../shared/ui/Toggle'
import { isRadialChartType } from '../chartDefinitions'
import { categoricalColorPalettes } from '../colorPalettes'
import { CHART_MARK_BORDER } from '../createChartInstance'
import { getColorEncodingMode } from '../getColorEncodingMode'
import LabelsWidget from './LabelsWidget'

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type {
  ChartFormatElement,
  ChartFormatProps,
  LinePoints,
  ScatterSymbol,
} from '../types'

// ===== TYPES =================================================================
/** One place of the marks element, e.g. its fill. */
export type MarkGroupKey = (typeof MARK_GROUP_ORDER)[number]

/** Groups a chart type fills; places it does not have stay empty. */
type MarkGroups = Partial<Record<MarkGroupKey, ReactNode>>

/** Marks that are filled shapes with a border: points, bars, segments. */
type FilledMarkKey = 'bar' | 'pie' | 'scatter'

type MarkGroupProps = Pick<ChartFormatProps, 'actions' | 'chart'>

/** Switches the popover to another element, e.g. the tooltip. */
type ElementChange = (element: ChartFormatElement) => void

// ===== CONSTANTS =============================================================
/**
 * Fixed order of the groups of the marks element, the same for every
 * chart type: Data color → Shape → Fill → Stroke → Effect → Points →
 * Labels → Tooltip. The data color is the group drawn with it, e.g. Fill
 * for bars or Line for lines.
 */
export const MARK_GROUP_ORDER = [
  'dataColor',
  'shape',
  'fill',
  'stroke',
  'effect',
  'points',
  'labels',
  'tooltip',
] as const

const linePointsOptions = [
  { label: 'Auto', value: 'auto' },
  { label: 'On', value: 'on' },
  { label: 'Off', value: 'off' },
] satisfies { label: string; value: LinePoints }[]

const scatterSymbolOptions = [
  { label: 'Circle', value: 'circle' },
  { label: 'Square', value: 'rect' },
  { label: 'Triangle', value: 'triangle' },
  { label: 'Diamond', value: 'diamond' },
] satisfies { label: string; value: ScatterSymbol }[]

const scatterSymbolIcons = {
  circle: Circle,
  diamond: Diamond,
  rect: Square,
  triangle: Triangle,
} satisfies Record<ScatterSymbol, LucideIcon>

// ===== HELPERS ===============================================================
/**
 * Group without rows whose paintbrush opens another element, e.g. the
 * tooltip.
 * @param title Title of the group.
 * @param element Element the paintbrush opens.
 * @param onElementChange Switches the popover to that element.
 * @returns The group with a paintbrush in its heading.
 */
function getElementLinkGroup(
  title: string,
  element: ChartFormatElement,
  onElementChange: ElementChange,
): ReactNode {
  return (
    <FormatWidget title={title} onFormat={() => onElementChange(element)} />
  )
}

/**
 * Field of the data color in the color row of the marks: one color, a
 * palette for categories, or a gradient when a continuous field colors
 * the marks.
 * @param formatProps Actions, chart and fields of the chart.
 * @returns The field of the color mode.
 */
function getDataColorField({
  actions,
  chart,
  fields,
}: ChartFormatProps): ReactNode {
  const { appearance } = chart.spec
  const colorEncodingMode = getColorEncodingMode(
    chart.type,
    chart.spec.data.encoding,
    fields,
  )
  if (colorEncodingMode === 'constant') {
    return (
      <ColorField
        label="Chart"
        presets={DATA_COLOR_PRESETS}
        value={appearance.color}
        onChange={(color) => actions.setAppearance('color', color)}
      />
    )
  }
  if (colorEncodingMode === 'categorical') {
    return (
      <PaletteControl
        label="Categorical color palette"
        palettes={categoricalColorPalettes}
        value={appearance.colorScale.categorical.palette}
        onChange={(palette) => {
          actions.setAppearance('colorScale', {
            ...appearance.colorScale,
            categorical: { ...appearance.colorScale.categorical, palette },
          })
        }}
      />
    )
  }
  const { continuous } = appearance.colorScale
  return (
    <GradientControl
      label="Chart"
      startColor={continuous.startColor}
      endColor={continuous.endColor}
      onChange={({ startColor, endColor }) => {
        actions.setAppearance('colorScale', {
          ...appearance.colorScale,
          continuous: { ...continuous, startColor, endColor },
        })
      }}
    />
  )
}

/**
 * Fill, border and effect of a filled mark; points, bars and pie segments
 * share them. The fill is drawn with the data color, so it takes the
 * place of the data color and shows its field.
 * @param props Actions and chart of the chart.
 * @param mark Appearance key of the mark.
 * @param label Name of the mark for screen readers, e.g. "Bar".
 * @param dataColor Field of the data color.
 * @returns The data color, stroke and effect groups.
 */
function getFilledMarkGroups(
  { actions, chart }: MarkGroupProps,
  mark: FilledMarkKey,
  label: string,
  dataColor: ReactNode,
): MarkGroups {
  const { border, effect, fill } = chart.spec.appearance[mark]
  return {
    dataColor: (
      <FormatWidget title="Fill">
        <FillControls
          label={`${label} fill`}
          seriesColor={dataColor}
          value={fill}
          onChange={(value) => actions.setChartAppearance(mark, 'fill', value)}
        />
      </FormatWidget>
    ),
    effect: (
      <FormatWidget title="Effect">
        <EffectControls
          label={label}
          value={effect}
          onChange={(value) =>
            actions.setChartAppearance(mark, 'effect', value)
          }
        />
      </FormatWidget>
    ),
    stroke: (
      <FormatWidget title="Border">
        <StrokeStyleControls
          defaultColor={CHART_MARK_BORDER.color}
          label={`${label} border`}
          value={border}
          onChange={(value) =>
            actions.setChartAppearance(mark, 'border', value)
          }
        />
      </FormatWidget>
    ),
  }
}

/**
 * Groups only some chart types have: shape, and for lines their area,
 * line, glow and points.
 * @param props Actions and chart of the chart.
 * @param dataColor Field of the data color for the group drawn with it.
 * @returns The groups of the chart type.
 */
function getChartTypeGroups(
  props: MarkGroupProps,
  dataColor: ReactNode,
): MarkGroups {
  const { actions, chart } = props
  const { bar, line, pie, scatter } = chart.spec.appearance
  switch (chart.type) {
    case 'bar':
      return {
        ...getFilledMarkGroups(props, 'bar', 'Bar', dataColor),
        shape: (
          <FormatWidget title="Shape">
            <ControlRow label="Width">
              <Slider
                label="Bar width"
                min={8}
                max={64}
                step={2}
                value={bar.barWidth}
                onValueChange={(barWidth) => {
                  actions.setChartAppearance('bar', 'barWidth', barWidth)
                }}
              />
            </ControlRow>
            <ControlRow label="Radius">
              <Slider
                label="Corner radius"
                min={0}
                max={24}
                step={1}
                value={bar.borderRadius}
                onValueChange={(borderRadius) => {
                  actions.setChartAppearance(
                    'bar',
                    'borderRadius',
                    borderRadius,
                  )
                }}
              />
            </ControlRow>
          </FormatWidget>
        ),
      }
    case 'donut':
    case 'pie':
      return {
        ...getFilledMarkGroups(props, 'pie', 'Segment', dataColor),
        shape:
          chart.type === 'donut' ? (
            <FormatWidget title="Shape">
              <ControlRow label="Inner radius">
                <Slider
                  label="Donut inner radius"
                  min={20}
                  max={60}
                  step={2}
                  value={pie.innerRadius}
                  onValueChange={(innerRadius) => {
                    actions.setChartAppearance(
                      'pie',
                      'innerRadius',
                      innerRadius,
                    )
                  }}
                />
              </ControlRow>
            </FormatWidget>
          ) : null,
      }
    case 'line':
      return {
        dataColor: (
          <FormatWidget title="Line">
            <StrokeStyleControls
              label="Line"
              minWidth={1}
              seriesColor={dataColor}
              value={line.stroke}
              onChange={(stroke) => {
                actions.setChartAppearance('line', 'stroke', stroke)
              }}
            />
          </FormatWidget>
        ),
        effect: (
          <FormatWidget title="Effect">
            <EffectControls
              label="Line"
              value={line.effect}
              onChange={(effect) => {
                actions.setChartAppearance('line', 'effect', effect)
              }}
            />
          </FormatWidget>
        ),
        fill: (
          <FormatWidget
            title="Area"
            visibility={{
              visible: line.areaFill,
              onChange: (areaFill) => {
                actions.setChartAppearance('line', 'areaFill', areaFill)
              },
            }}
          >
            <FillControls
              label="Area fill"
              value={line.area}
              onChange={(area) => {
                actions.setChartAppearance('line', 'area', area)
              }}
            />
          </FormatWidget>
        ),
        points: (
          <FormatWidget title="Points">
            <ControlRow label="Show">
              <SegmentedControl
                label="Line points"
                options={linePointsOptions}
                value={line.points}
                onValueChange={(points) => {
                  actions.setChartAppearance('line', 'points', points)
                }}
              />
            </ControlRow>
          </FormatWidget>
        ),
        shape: (
          <FormatWidget title="Shape">
            <ControlRow label="Smooth">
              <Toggle
                label="Smooth line"
                checked={line.smooth}
                onCheckedChange={(smooth) => {
                  actions.setChartAppearance('line', 'smooth', smooth)
                }}
              />
            </ControlRow>
          </FormatWidget>
        ),
      }
    case 'scatter':
      return {
        ...getFilledMarkGroups(props, 'scatter', 'Point', dataColor),
        shape: (
          <FormatWidget title="Shape">
            <ControlRow label="Symbol">
              <SegmentedControl
                label="Scatter symbol"
                options={scatterSymbolOptions}
                value={scatter.symbol}
                renderOption={(option) => {
                  const SymbolIcon = scatterSymbolIcons[option.value]
                  return <SymbolIcon aria-hidden="true" size={13} />
                }}
                onValueChange={(symbol) => {
                  actions.setChartAppearance('scatter', 'symbol', symbol)
                }}
              />
            </ControlRow>
            {chart.spec.data.encoding.size ? (
              <ControlRow label="Size range">
                <RangeSlider
                  label="Point size range"
                  max={60}
                  min={2}
                  value={[scatter.sizeRange.min, scatter.sizeRange.max]}
                  onValueChange={([min, max]) => {
                    actions.setChartAppearance('scatter', 'sizeRange', {
                      max,
                      min,
                    })
                  }}
                />
              </ControlRow>
            ) : (
              <ControlRow label="Size">
                <Slider
                  label="Point size"
                  min={4}
                  max={28}
                  step={1}
                  value={scatter.pointSize}
                  onValueChange={(pointSize) => {
                    actions.setChartAppearance(
                      'scatter',
                      'pointSize',
                      pointSize,
                    )
                  }}
                />
              </ControlRow>
            )}
          </FormatWidget>
        ),
      }
  }
}

// ===== FUNCTION ==============================================================
/**
 * Fills the places of the marks element for the chart type, e.g. Shape
 * with width and radius for bars. Places a chart type does not have stay
 * empty and drop out of the popover; `MARK_GROUP_ORDER` sets the order.
 * @param formatProps Actions, chart and fields of the chart.
 * @param onElementChange Switches the popover to the tooltip.
 * @returns The groups by place.
 */
export function getMarkGroups(
  formatProps: ChartFormatProps,
  onElementChange: ElementChange,
): MarkGroups {
  const { actions, chart } = formatProps
  const dataColor = getDataColorField(formatProps)
  return {
    ...getChartTypeGroups(formatProps, dataColor),
    labels: (
      <LabelsWidget
        isRadial={isRadialChartType(chart.type)}
        value={chart.spec.appearance.labels}
        onChange={(value) => actions.setAppearance('labels', value)}
      />
    ),
    tooltip: getElementLinkGroup('Tooltip', 'tooltip', onElementChange),
  }
}
