import {
  ArrowDownToLine,
  ArrowUpToLine,
  ChartLine,
  ChartSpline,
  Circle,
  CircleDot,
  CircleDotDashed,
  Diamond,
  Donut,
  Scaling,
  Square,
  SquareRoundCorner,
  Triangle,
  UnfoldHorizontal,
} from 'lucide-react'

import {
  getChartDefinition,
  isRadialChartType,
} from '@/charts/chartDefinitions'
import { getCategoricalPalettes } from '@/charts/colorPalettes'
import { getColorEncodingMode } from '@/charts/getColorEncodingMode'
import { isMarkEffect } from '@/shared/effect'
import ColorControl from '@/shared/ui/controls/ColorControl'
import ScrubbableNumber from '@/shared/ui/controls/ScrubbableNumber'
import SegmentedControl from '@/shared/ui/controls/SegmentedControl'
import EffectsGroup from '@/shared/ui/groups/EffectsGroup'
import Group from '@/shared/ui/groups/Group'
import StrokeGroup from '@/shared/ui/groups/StrokeGroup'
import StrokeStyleControls from '@/shared/ui/groups/StrokeStyleControls'
import PaintRow from '@/shared/ui/rows/PaintRow'
import Row from '@/shared/ui/rows/Row'
import GradientControl from './GradientControl'
import LabelsGroup from './LabelsGroup'
import PaletteControl from './PaletteControl'
import TooltipGroup from './TooltipGroup'

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type {
  ChartFormatProps,
  ColorScaleAppearance,
  LinePoints,
  ScatterSymbol,
} from '@/charts/types'
import type { Effect, MarkEffect } from '@/shared/effect'
import type { PaintType } from '@/shared/paint'
import type { OptionItem } from '@/shared/ui/primitives/OptionsMenu'
import type { RowDetails } from '@/shared/ui/rows/Row'

// ===== TYPES =================================================================
/** One place of the marks element, e.g. its fill. */
export type MarkGroupKey = (typeof MARK_GROUP_ORDER)[number]

/** Groups a chart type fills; places it does not have stay empty. */
type MarkGroups = Partial<Record<MarkGroupKey, ReactNode>>

/** Marks that are filled shapes with a border: points, bars, segments. */
type FilledMarkKey = 'bar' | 'pie' | 'scatter'

type MarkGroupProps = Pick<ChartFormatProps, 'actions' | 'chart'>

/**
 * Data color of the marks: its field, and for a continuous scale its range
 * behind a gear and the paint types it allows.
 */
type DataColorControls = {
  details?: RowDetails
  field: ReactNode
  paintTypes?: PaintType[]
}

/** Course of a line between its points: straight or a smooth curve. */
type LineCurve = 'smooth' | 'straight'

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

/** Effect kinds of a mark: ECharts draws one blurred shadow per mark. */
const MARK_EFFECT_KINDS: MarkEffect['kind'][] = ['glow', 'shadow']

/** Strongest blur of a mark effect; wider blurs wash out and cost time. */
const MAX_MARK_EFFECT_BLUR = 40

const lineCurveOptions = [
  { icon: ChartLine, label: 'Straight', value: 'straight' },
  { icon: ChartSpline, label: 'Smooth', value: 'smooth' },
] satisfies OptionItem<LineCurve>[]

const linePointsOptions = [
  { icon: CircleDotDashed, label: 'Auto', value: 'auto' },
  { icon: CircleDot, label: 'Always', value: 'on' },
] satisfies OptionItem<LinePoints>[]

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
 * Data color in the color row of the marks: one color, a palette for
 * categories, or a gradient when a continuous field colors the marks; the
 * gradient brings the range of its scale behind a gear and allows only
 * solid paints, since its visual map colors every mark itself.
 * @param formatProps Actions, chart, fields and style of the chart.
 * @returns The field of the color mode and, for a gradient, its details.
 */
function getDataColorControls({
  actions,
  chart,
  fields,
  style,
}: ChartFormatProps): DataColorControls {
  const { appearance } = chart.spec
  const colorEncodingMode = getColorEncodingMode(
    chart.type,
    chart.spec.data.encoding,
    fields,
  )
  if (colorEncodingMode === 'constant') {
    return {
      field: (
        <ColorControl
          label="Chart"
          value={appearance.color}
          onChange={(color) => actions.setAppearance('color', color)}
        />
      ),
    }
  }
  if (colorEncodingMode === 'categorical') {
    return {
      field: (
        <PaletteControl
          label="Categorical color palette"
          palettes={getCategoricalPalettes(style)}
          value={appearance.colorScale.categorical.palette}
          onChange={(palette) => {
            actions.setAppearance('colorScale', {
              ...appearance.colorScale,
              categorical: { ...appearance.colorScale.categorical, palette },
            })
          }}
        />
      ),
    }
  }
  const { continuous } = appearance.colorScale

  /** Saves changed fields of the continuous scale, e.g. its minimum. */
  function setContinuous(
    changes: Partial<ColorScaleAppearance['continuous']>,
  ): void {
    actions.setAppearance('colorScale', {
      ...appearance.colorScale,
      continuous: { ...continuous, ...changes },
    })
  }

  return {
    details: {
      label: 'Color range',
      content: (
        <Row>
          <ScrubbableNumber
            icon={<ArrowDownToLine size={14} />}
            label="Color scale minimum"
            value={continuous.min}
            onAuto={() => setContinuous({ min: null })}
            onValueChange={(min) => setContinuous({ min })}
          />
          <ScrubbableNumber
            icon={<ArrowUpToLine size={14} />}
            label="Color scale maximum"
            value={continuous.max}
            onAuto={() => setContinuous({ max: null })}
            onValueChange={(max) => setContinuous({ max })}
          />
        </Row>
      ),
    },
    field: (
      <GradientControl
        label="Chart"
        stops={[
          { color: continuous.startColor, opacity: 1, position: 0 },
          { color: continuous.endColor, opacity: 1, position: 1 },
        ]}
        onChange={([start, end]) => {
          setContinuous({ endColor: end.color, startColor: start.color })
        }}
      />
    ),
    paintTypes: ['solid'],
  }
}

/**
 * Effect group of one mark: without an effect only the plus in its
 * heading, which adds a glow, else the row of the effect. A mark has one
 * effect, so the group sees it as a list of none or one.
 * @param label Name of the mark for screen readers, e.g. "Bar".
 * @param effect Effect of the mark.
 * @param onChange Saves the changed effect.
 * @returns The effect group.
 */
function getEffectGroup(
  label: string,
  effect: Effect,
  onChange: (effect: Effect) => void,
): ReactNode {
  return (
    <EffectsGroup
      kinds={MARK_EFFECT_KINDS}
      label={label}
      max={1}
      maxBlur={MAX_MARK_EFFECT_BLUR}
      title="Effect"
      value={effect.kind === 'none' ? [] : [effect]}
      onChange={(effects) => {
        onChange(effects.find(isMarkEffect) ?? { kind: 'none' })
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
 * @param dataColor Field and details of the data color.
 * @returns The data color, stroke and effect groups.
 */
function getFilledMarkGroups(
  { actions, chart }: MarkGroupProps,
  mark: FilledMarkKey,
  label: string,
  dataColor: DataColorControls,
): MarkGroups {
  const { border, effect, fill } = chart.spec.appearance[mark]
  return {
    dataColor: (
      <Group title="Fill">
        <PaintRow
          details={dataColor.details}
          label={`${label} fill`}
          paintTypes={dataColor.paintTypes}
          seriesColor={dataColor.field}
          value={fill}
          onChange={(value) => actions.setChartAppearance(mark, 'fill', value)}
        />
      </Group>
    ),
    effect: getEffectGroup(label, effect, (value) => {
      actions.setChartAppearance(mark, 'effect', value)
    }),
    stroke: (
      <StrokeGroup
        label={`${label} border`}
        title="Border"
        value={border}
        onChange={(value) => actions.setChartAppearance(mark, 'border', value)}
      />
    ),
  }
}

/**
 * Groups only some chart types have: shape, and for lines their area,
 * line, effect and points.
 * @param props Actions and chart of the chart.
 * @param dataColor Field and details of the data color for its group.
 * @returns The groups of the chart type.
 */
function getChartTypeGroups(
  props: MarkGroupProps,
  dataColor: DataColorControls,
): MarkGroups {
  const { actions, chart } = props
  const { bar, line, pie, scatter } = chart.spec.appearance
  const sizeField = chart.spec.data.encoding.size
  switch (chart.type) {
    case 'bar':
      return {
        ...getFilledMarkGroups(props, 'bar', 'Bar', dataColor),
        shape: (
          <Group title="Shape">
            <Row>
              <ScrubbableNumber
                icon={<UnfoldHorizontal size={14} />}
                label="Bar width"
                max={64}
                min={8}
                step={2}
                unit="px"
                value={bar.barWidth}
                onValueChange={(barWidth) => {
                  actions.setChartAppearance('bar', 'barWidth', barWidth)
                }}
              />
              <ScrubbableNumber
                icon={<SquareRoundCorner size={14} />}
                label="Corner radius"
                max={24}
                min={0}
                unit="px"
                value={bar.borderRadius}
                onValueChange={(borderRadius) => {
                  actions.setChartAppearance(
                    'bar',
                    'borderRadius',
                    borderRadius,
                  )
                }}
              />
            </Row>
          </Group>
        ),
      }
    case 'donut':
    case 'pie':
      return {
        ...getFilledMarkGroups(props, 'pie', 'Segment', dataColor),
        shape:
          chart.type === 'donut' ? (
            <Group title="Shape">
              <Row>
                <ScrubbableNumber
                  icon={<Donut size={14} />}
                  label="Donut inner radius"
                  max={60}
                  min={20}
                  step={2}
                  unit="%"
                  value={pie.innerRadius}
                  onValueChange={(innerRadius) => {
                    actions.setChartAppearance(
                      'pie',
                      'innerRadius',
                      innerRadius,
                    )
                  }}
                />
              </Row>
            </Group>
          ) : null,
      }
    case 'line':
      return {
        dataColor: (
          <Group title="Line">
            <StrokeStyleControls
              details={dataColor.details}
              label="Line"
              minWidth={1}
              paintTypes={dataColor.paintTypes}
              seriesColor={dataColor.field}
              value={line.stroke}
              onChange={(stroke) => {
                actions.setChartAppearance('line', 'stroke', stroke)
              }}
            />
          </Group>
        ),
        effect: getEffectGroup('Line', line.effect, (effect) => {
          actions.setChartAppearance('line', 'effect', effect)
        }),
        fill: (
          <Group
            title="Area"
            visibility={{
              visible: line.areaFill,
              onChange: (areaFill) => {
                actions.setChartAppearance('line', 'areaFill', areaFill)
              },
            }}
          >
            <PaintRow
              label="Area fill"
              value={line.area}
              onChange={(area) => {
                actions.setChartAppearance('line', 'area', area)
              }}
            />
          </Group>
        ),
        points: (
          <Group
            title="Points"
            visibility={{
              visible: line.points !== 'off',
              onChange: (visible) => {
                actions.setChartAppearance(
                  'line',
                  'points',
                  visible ? 'auto' : 'off',
                )
              },
            }}
          >
            <Row layout="wide">
              <SegmentedControl
                label="Line points"
                options={linePointsOptions}
                value={line.points}
                onValueChange={(points) => {
                  actions.setChartAppearance('line', 'points', points)
                }}
              />
            </Row>
          </Group>
        ),
        shape: (
          <Group title="Shape">
            <Row layout="wide">
              <SegmentedControl
                label="Line curve"
                options={lineCurveOptions}
                value={line.smooth ? 'smooth' : 'straight'}
                onValueChange={(curve) => {
                  actions.setChartAppearance(
                    'line',
                    'smooth',
                    curve === 'smooth',
                  )
                }}
              />
            </Row>
          </Group>
        ),
      }
    case 'scatter':
      return {
        ...getFilledMarkGroups(props, 'scatter', 'Point', dataColor),
        shape: (
          <Group title="Shape">
            <Row>
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
              {sizeField ? null : (
                <ScrubbableNumber
                  icon={<Scaling size={14} />}
                  label="Point size"
                  max={28}
                  min={4}
                  unit="px"
                  value={scatter.pointSize}
                  onValueChange={(pointSize) => {
                    actions.setChartAppearance(
                      'scatter',
                      'pointSize',
                      pointSize,
                    )
                  }}
                />
              )}
            </Row>
            {sizeField ? (
              <Row>
                <ScrubbableNumber
                  icon={<ArrowDownToLine size={14} />}
                  label="Smallest point size"
                  max={scatter.sizeRange.max}
                  min={2}
                  unit="px"
                  value={scatter.sizeRange.min}
                  onValueChange={(min) => {
                    actions.setChartAppearance('scatter', 'sizeRange', {
                      ...scatter.sizeRange,
                      min,
                    })
                  }}
                />
                <ScrubbableNumber
                  icon={<ArrowUpToLine size={14} />}
                  label="Largest point size"
                  max={60}
                  min={scatter.sizeRange.min}
                  unit="px"
                  value={scatter.sizeRange.max}
                  onValueChange={(max) => {
                    actions.setChartAppearance('scatter', 'sizeRange', {
                      ...scatter.sizeRange,
                      max,
                    })
                  }}
                />
              </Row>
            ) : null}
          </Group>
        ),
      }
  }
}

// ===== FUNCTION ==============================================================
/**
 * Fills the places of the marks element for the chart type, e.g. Shape
 * with width and radius for bars. Places a chart type does not have stay
 * empty and drop out of the panel; `MARK_GROUP_ORDER` sets the order. The
 * data labels and the tooltip are groups like the others, each with its
 * own subgroups.
 * @param formatProps Actions, chart and fields of the chart.
 * @returns The groups by place.
 */
export function getMarkGroups(formatProps: ChartFormatProps): MarkGroups {
  const { actions, chart } = formatProps
  const { labels } = chart.spec.appearance
  const { tooltip } = chart.spec.interaction
  const isRadial = isRadialChartType(chart.type)
  const dataColor = getDataColorControls(formatProps)
  return {
    ...getChartTypeGroups(formatProps, dataColor),
    labels: (
      <LabelsGroup
        isRadial={isRadial}
        positions={getChartDefinition(chart.type).labelPositions}
        value={labels}
        onChange={(value) => actions.setAppearance('labels', value)}
      />
    ),
    tooltip: (
      <TooltipGroup
        appearance={chart.spec.appearance.tooltip}
        showTrigger={!isRadial}
        value={tooltip}
        onAppearanceChange={(value) => actions.setAppearance('tooltip', value)}
        onChange={(value) => actions.setInteraction('tooltip', value)}
      />
    ),
  }
}
