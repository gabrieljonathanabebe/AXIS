import { Circle, Diamond, Paintbrush, Square, Triangle } from 'lucide-react'

import { categoricalColorPalettes } from '../../../chart/colorPalettes'
import ColorControl from '../../ui/ColorControl'
import ControlRow from '../../ui/ControlRow'
import PaletteControl from '../../ui/PaletteControl'
import SegmentedControl from '../../ui/SegmentedControl'
import Slider from '../../ui/Slider'
import Toggle from '../../ui/Toggle'
import InspectorWidget from '../InspectorWidget'

import type { ChartInspectorProps } from '../types'
import type { ScatterSymbol } from '../../../types/chart'

type MarkSeriesWidgetProps = Pick<
  ChartInspectorProps,
  'chart' | 'onSetAppearance' | 'onSetChartAppearance'
>

const scatterSymbolOptions = [
  { label: 'Circle', value: 'circle' },
  { label: 'Square', value: 'rect' },
  { label: 'Triangle', value: 'triangle' },
  { label: 'Diamond', value: 'diamond' },
] satisfies { label: string; value: ScatterSymbol }[]

const scatterSymbolIcons = {
  circle: Circle,
  rect: Square,
  triangle: Triangle,
  diamond: Diamond,
} satisfies Record<ScatterSymbol, typeof Circle>

function MarkSeriesWidget({
  chart,
  onSetAppearance,
  onSetChartAppearance,
}: MarkSeriesWidgetProps) {
  // CONSTANTS
  const { appearance } = chart.spec
  const hasSizeEncoding = Boolean(chart.spec.data.encoding.size)
  const colorField = chart.spec.data.encoding.color
  const hasColorEncoding = Boolean(colorField)
  const hasContinuousColorEncoding = colorField?.semantic_type === 'numeric'
  const hasCategoricalColorEncoding =
    colorField?.semantic_type === 'categorical'
  // RETURN
  return (
    <InspectorWidget title="Mark / Series" icon={<Paintbrush size={16} />}>
      {!hasColorEncoding ? (
        <ControlRow label="Color">
          <ColorControl
            label="Chart color"
            value={appearance.color}
            onChange={(color) => {
              onSetAppearance('color', color)
            }}
          />
        </ControlRow>
      ) : null}
      {hasContinuousColorEncoding ? (
        <>
          <ControlRow label="Low color">
            <ColorControl
              label="Low value color"
              value={appearance.colorScale.continuous.startColor}
              onChange={(startColor) => {
                onSetAppearance('colorScale', {
                  ...appearance.colorScale,
                  continuous: {
                    ...appearance.colorScale.continuous,
                    startColor,
                  },
                })
              }}
            />
          </ControlRow>

          <ControlRow label="High color">
            <ColorControl
              label="High value color"
              value={appearance.colorScale.continuous.endColor}
              onChange={(endColor) => {
                onSetAppearance('colorScale', {
                  ...appearance.colorScale,
                  continuous: {
                    ...appearance.colorScale.continuous,
                    endColor,
                  },
                })
              }}
            />
          </ControlRow>
        </>
      ) : null}
      {hasCategoricalColorEncoding ? (
        <ControlRow label="Palette">
          <PaletteControl
            label="Categorical color palette"
            palettes={categoricalColorPalettes}
            value={appearance.colorScale.categorical.palette}
            onChange={(palette) => {
              onSetAppearance('colorScale', {
                ...appearance.colorScale,
                categorical: {
                  ...appearance.colorScale.categorical,
                  palette,
                },
              })
            }}
          />
        </ControlRow>
      ) : null}
      {chart.type === 'scatter' ? (
        <>
          <ControlRow label="Symbol">
            <SegmentedControl
              label="Scatter symbol"
              options={scatterSymbolOptions}
              value={appearance.scatter.symbol}
              renderOption={(option) => {
                const SymbolIcon = scatterSymbolIcons[option.value]
                return <SymbolIcon aria-hidden="true" size={13} />
              }}
              onValueChange={(symbol) => {
                onSetChartAppearance('scatter', 'symbol', symbol)
              }}
            />
          </ControlRow>
          {!hasSizeEncoding ? (
            <ControlRow label="Point size">
              <Slider
                label="Point size"
                min={4}
                max={28}
                step={1}
                value={appearance.scatter.pointSize}
                onValueChange={(pointSize) => {
                  onSetChartAppearance('scatter', 'pointSize', pointSize)
                }}
              />
            </ControlRow>
          ) : null}
          <ControlRow label="Opacity">
            <Slider
              label="Opacity"
              min={0.1}
              max={1}
              step={0.05}
              value={appearance.scatter.opacity}
              onValueChange={(opacity) => {
                onSetChartAppearance('scatter', 'opacity', opacity)
              }}
            />
          </ControlRow>
        </>
      ) : null}
      {chart.type === 'line' ? (
        <>
          <ControlRow label="Line width">
            <Slider
              label="Line width"
              min={1}
              max={8}
              step={0.5}
              value={appearance.line.lineWidth}
              onValueChange={(lineWidth) => {
                onSetChartAppearance('line', 'lineWidth', lineWidth)
              }}
            />
          </ControlRow>
          <ControlRow label="Smooth">
            <Toggle
              label="Smooth line"
              checked={appearance.line.smooth}
              onCheckedChange={(smooth) => {
                onSetChartAppearance('line', 'smooth', smooth)
              }}
            />
          </ControlRow>
          <ControlRow label="Show points">
            <Toggle
              label="Show data points"
              checked={appearance.line.showSymbol}
              onCheckedChange={(showSymbol) => {
                onSetChartAppearance('line', 'showSymbol', showSymbol)
              }}
            />
          </ControlRow>
        </>
      ) : null}
      {chart.type === 'bar' ? (
        <>
          <ControlRow label="Bar width">
            <Slider
              label="Bar width"
              min={8}
              max={64}
              step={2}
              value={appearance.bar.barWidth}
              onValueChange={(barWidth) => {
                onSetChartAppearance('bar', 'barWidth', barWidth)
              }}
            />
          </ControlRow>
          <ControlRow label="Radius">
            <Slider
              label="Corner radius"
              min={0}
              max={24}
              step={1}
              value={appearance.bar.borderRadius}
              onValueChange={(borderRadius) => {
                onSetChartAppearance('bar', 'borderRadius', borderRadius)
              }}
            />
          </ControlRow>
        </>
      ) : null}
    </InspectorWidget>
  )
}

export default MarkSeriesWidget
