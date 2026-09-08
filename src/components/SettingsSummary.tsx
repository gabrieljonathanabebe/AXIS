import type { ChartConfig } from '../types/chart'

type SettingsSummaryProps = {
  chartConfig: ChartConfig
}

function SettingsSummary({ chartConfig }: SettingsSummaryProps) {
  return (
    <div className="settings-summary">
      <div>
        <span>Chart Type</span>
        <strong>{chartConfig.type ?? 'empty'}</strong>
      </div>

      <div>
        <span>X</span>
        <strong>{chartConfig.encoding.x?.name ?? 'empty'}</strong>
      </div>

      <div>
        <span>Y</span>
        <strong>{chartConfig.encoding.y?.name ?? 'empty'}</strong>
      </div>
    </div>
  )
}

export default SettingsSummary
