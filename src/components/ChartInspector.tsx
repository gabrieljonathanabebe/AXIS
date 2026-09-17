import { Database, Paintbrush, SlidersHorizontal } from 'lucide-react'

import CollapsibleSection from './ui/CollapsibleSection'
import ControlRow from './ui/ControlRow'
import { getChartDefinition } from '../chart/chartDefinitions'
import { getCompatibleFields } from '../chart/getCompatibleFields'
import SelectControl from './ui/SelectControl'
import Slider from './ui/Slider'
import Toggle from './ui/Toggle'

import type {
  Aggregation,
  ChartAppearanceSpec,
  ChartEncoding,
  ChartInstance,
  ChartInteractionSpec,
  DataField,
} from '../types/chart'
import ColorSwatchPicker from './ui/ColorSwatchPicker'

// ===== PROPS =================================================================
type ChartInspectorProps = {
  chart: ChartInstance
  fields: DataField[]
  onSetAggregation: (aggregation: Aggregation) => void
  onSetAppearance: <TKey extends keyof ChartAppearanceSpec>(
    key: TKey,
    value: ChartAppearanceSpec[TKey],
  ) => void
  onSetInteraction: <TKey extends keyof ChartInteractionSpec>(
    key: TKey,
    value: ChartInteractionSpec[TKey],
  ) => void
  onSetChartAppearance: <
    TChartKey extends 'scatter' | 'line' | 'bar',
    TOptionKey extends keyof ChartAppearanceSpec[TChartKey],
  >(
    chartKey: TChartKey,
    optionKey: TOptionKey,
    value: ChartAppearanceSpec[TChartKey][TOptionKey],
  ) => void
  onSetEncodingField: (axis: keyof ChartEncoding, fieldName: string) => void
}

const aggregationOptions = [
  { label: 'None', value: 'none' },
  { label: 'Sum', value: 'sum' },
  { label: 'Mean', value: 'mean' },
  { label: 'Median', value: 'median' },
  { label: 'Min', value: 'min' },
  { label: 'Max', value: 'max' },
  { label: 'Count', value: 'count' },
] satisfies { label: string; value: Aggregation }[]

const colorOptions = [
  { label: 'Electric Blue', value: '#1e90ff' },
  { label: 'Cyan', value: '#22d3ee' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Mint', value: '#34d399' },
  { label: 'Rose', value: '#fb7185' },
] satisfies { label: string; value: string }[]

function ChartInspector({
  chart,
  fields,
  onSetAggregation,
  onSetAppearance,
  onSetInteraction,
  onSetChartAppearance,
  onSetEncodingField,
}: ChartInspectorProps) {
  const activeDefinition = getChartDefinition(chart.type)
  const { data, appearance, interaction } = chart.spec

  const activeAggregationOptions = aggregationOptions.filter((option) => {
    return activeDefinition.supportedAggregations.includes(option.value)
  })
  return (
    <div className="stack">
      {activeDefinition ? (
        <>
          <CollapsibleSection title="Data" icon={<Database size={18} />}>
            <div className="stack inspector-controls">
              {activeDefinition.encodings.map((encoding) => {
                const compatibleFields = getCompatibleFields(
                  activeDefinition.type,
                  encoding.key,
                  fields,
                )
                const compatibleFieldOptions = compatibleFields.map(
                  (field) => ({
                    label: field.name,
                    value: field.name,
                  }),
                )
                return (
                  <ControlRow key={encoding.key} label={encoding.label}>
                    <SelectControl
                      label={`${encoding.label} field`}
                      options={compatibleFieldOptions}
                      value={data.encoding[encoding.key]?.name ?? ''}
                      placeholder="Select field"
                      onChange={(fieldName) => {
                        onSetEncodingField(encoding.key, fieldName)
                      }}
                    />
                  </ControlRow>
                )
              })}
              <ControlRow label="Aggregation">
                <SelectControl
                  label="Aggregation"
                  options={activeAggregationOptions}
                  value={
                    data.aggregation ?? activeDefinition.defaultAggregation
                  }
                  onChange={onSetAggregation}
                />
              </ControlRow>
            </div>
          </CollapsibleSection>
          <CollapsibleSection
            title="Appearance"
            icon={<Paintbrush size={18} />}
          >
            <div className="stack inspector-controls">
              <ControlRow label="Color">
                <ColorSwatchPicker
                  label="Chart color"
                  options={colorOptions}
                  value={appearance.color}
                  onChange={(value) => {
                    onSetAppearance('color', value)
                  }}
                />
              </ControlRow>
              <ControlRow label="Grid">
                <Toggle
                  label="Show grid"
                  checked={appearance.showGrid}
                  onCheckedChange={(checked) => {
                    onSetAppearance('showGrid', checked)
                  }}
                />
              </ControlRow>
              <ControlRow label="Tooltip">
                <Toggle
                  label="Show tooltip"
                  checked={interaction.tooltip.enabled}
                  onCheckedChange={(enabled) => {
                    onSetInteraction('tooltip', { enabled })
                  }}
                />
              </ControlRow>
              <ControlRow label="Animation">
                <Toggle
                  label="Enable animation"
                  checked={interaction.animation.enabled}
                  onCheckedChange={(enabled) => {
                    onSetInteraction('animation', { enabled })
                  }}
                />
              </ControlRow>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Mark"
            icon={<SlidersHorizontal size={18} />}
          >
            <div className="stack inspector-controls">
              {chart.type === 'scatter' ? (
                <>
                  <ControlRow label="Point size">
                    <Slider
                      label="Point size"
                      min={4}
                      max={28}
                      step={1}
                      value={appearance.scatter.pointSize}
                      onValueChange={(value) => {
                        onSetChartAppearance('scatter', 'pointSize', value)
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
                      onValueChange={(value) => {
                        onSetChartAppearance('scatter', 'opacity', value)
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
                      onValueChange={(value) => {
                        onSetChartAppearance('line', 'lineWidth', value)
                      }}
                    />
                  </ControlRow>
                  <ControlRow label="Smooth">
                    <Toggle
                      label="Smooth line"
                      checked={appearance.line.smooth}
                      onCheckedChange={(checked) => {
                        onSetChartAppearance('line', 'smooth', checked)
                      }}
                    />
                  </ControlRow>
                  <ControlRow label="Show points">
                    <Toggle
                      label="Show data points"
                      checked={appearance.line.showSymbol}
                      onCheckedChange={(checked) => {
                        onSetChartAppearance('line', 'showSymbol', checked)
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
                      onValueChange={(value) => {
                        onSetChartAppearance('bar', 'barWidth', value)
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
                      onValueChange={(value) => {
                        onSetChartAppearance('bar', 'borderRadius', value)
                      }}
                    />
                  </ControlRow>
                </>
              ) : null}
            </div>
          </CollapsibleSection>
        </>
      ) : null}
    </div>
  )
}

export default ChartInspector
