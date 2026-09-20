import { Paintbrush } from 'lucide-react'

import ColorControl from '../../ui/ColorControl'
import ControlRow from '../../ui/ControlRow'
import Slider from '../../ui/Slider'
import Toggle from '../../ui/Toggle'
import InspectorWidget from '../InspectorWidget'

import type { ChartInspectorProps } from '../types'

type MarkSeriesWidgetProps = Pick<
  ChartInspectorProps,
  'chart' | 'onSetAppearance' | 'onSetChartAppearance'
>

function MarkSeriesWidget({
  chart,
  onSetAppearance,
  onSetChartAppearance,
}: MarkSeriesWidgetProps) {
  const { appearance } = chart.spec
  return (
    <InspectorWidget title="Mark / Series" icon={<Paintbrush size={16} />}>
      <ControlRow label="Color">
        <ColorControl
          label="Chart color"
          value={appearance.color}
          onChange={(color) => {
            onSetAppearance('color', color)
          }}
        />
      </ControlRow>
      {chart.type === 'scatter' ? (
        <>
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
