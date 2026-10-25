import { ChevronRight, Circle, Diamond, Square, Triangle } from 'lucide-react'

import Button from '../../shared/ui/Button'
import ColorControl from '../../shared/ui/ColorControl'
import { DATA_COLOR_PRESETS } from '../../shared/ui/colorPresets'
import ControlRow from '../../shared/ui/ControlRow'
import EffectControls from '../../shared/ui/EffectControls'
import FillControls from '../../shared/ui/FillControls'
import FormatWidget from '../../shared/ui/FormatWidget'
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
 * chart type: Color → Shape → Fill → Stroke → Effect → Points → Labels →
 * Tooltip.
 */
export const MARK_GROUP_ORDER = [
  'color',
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
 * Group with one row that opens another element, e.g. the tooltip.
 * @param title Title of the group.
 * @param rowLabel Label of the row.
 * @param element Element the button opens.
 * @param onElementChange Switches the popover to that element.
 * @returns The group with an "Edit" button.
 */
function getElementLinkGroup(
  title: string,
  rowLabel: string,
  element: ChartFormatElement,
  onElementChange: ElementChange,
): ReactNode {
  return (
    <FormatWidget title={title}>
      <ControlRow label={rowLabel}>
        <Button
          size="sm"
          variant="accent"
          onClick={() => onElementChange(element)}
        >
          Edit
          <ChevronRight aria-hidden="true" size={14} />
        </Button>
      </ControlRow>
    </FormatWidget>
  )
}

/**
 * Color group: one color, a palette for categories, or a link to the color
 * scale when a continuous field colors the marks.
 * @param formatProps Actions, chart and fields of the chart.
 * @param onElementChange Switches the popover to the color scale.
 * @returns The group of the color mode.
 */
function getColorGroup(
  { actions, chart, fields }: ChartFormatProps,
  onElementChange: ElementChange,
): ReactNode {
  const { appearance } = chart.spec
  const colorEncodingMode = getColorEncodingMode(
    chart.type,
    chart.spec.data.encoding,
    fields,
  )
  if (colorEncodingMode === 'constant') {
    return (
      <FormatWidget title="Color">
        <ControlRow label="Color">
          <ColorControl
            label="Chart color"
            presets={DATA_COLOR_PRESETS}
            value={appearance.color}
            onChange={(color) => actions.setAppearance('color', color)}
          />
        </ControlRow>
      </FormatWidget>
    )
  }
  if (colorEncodingMode === 'categorical') {
    return (
      <FormatWidget title="Color">
        <ControlRow label="Palette">
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
        </ControlRow>
      </FormatWidget>
    )
  }
  return getElementLinkGroup(
    'Color',
    'Color scale',
    'colorScale',
    onElementChange,
  )
}

/**
 * Fill, border and effect of a filled mark; points, bars and pie segments
 * share them.
 * @param props Actions and chart of the chart.
 * @param mark Appearance key of the mark.
 * @param label Name of the mark for screen readers, e.g. "Bar".
 * @returns The fill, stroke and effect groups.
 */
function getFilledMarkGroups(
  { actions, chart }: MarkGroupProps,
  mark: FilledMarkKey,
  label: string,
): MarkGroups {
  const { border, effect, fill } = chart.spec.appearance[mark]
  return {
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
    fill: (
      <FormatWidget title="Fill">
        <FillControls
          label={`${label} fill`}
          value={fill}
          onChange={(value) => actions.setChartAppearance(mark, 'fill', value)}
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
 * @returns The groups of the chart type.
 */
function getChartTypeGroups(props: MarkGroupProps): MarkGroups {
  const { actions, chart } = props
  const { bar, line, pie, scatter } = chart.spec.appearance
  switch (chart.type) {
    case 'bar':
      return {
        ...getFilledMarkGroups(props, 'bar', 'Bar'),
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
        ...getFilledMarkGroups(props, 'pie', 'Segment'),
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
        stroke: (
          <FormatWidget title="Line">
            <StrokeStyleControls
              label="Line"
              minWidth={1}
              value={line.stroke}
              onChange={(stroke) => {
                actions.setChartAppearance('line', 'stroke', stroke)
              }}
            />
          </FormatWidget>
        ),
      }
    case 'scatter':
      return {
        ...getFilledMarkGroups(props, 'scatter', 'Point'),
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
  return {
    ...getChartTypeGroups(formatProps),
    color: getColorGroup(formatProps, onElementChange),
    labels: (
      <LabelsWidget
        isRadial={isRadialChartType(chart.type)}
        value={chart.spec.appearance.labels}
        onChange={(value) => actions.setAppearance('labels', value)}
      />
    ),
    tooltip: getElementLinkGroup(
      'Tooltip',
      'Settings',
      'tooltip',
      onElementChange,
    ),
  }
}
