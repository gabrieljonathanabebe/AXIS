import type { ChartConfig } from '../types/chart'

type SettingsSummaryProps = {
  chartConfig: ChartConfig
}

function SettingsSummary({ chartConfig }: SettingsSummaryProps) {
  return (
    <div className="stack">
      <div className="spread">
        <span>Chart Type</span>
        <strong className="text-strong">{chartConfig.type ?? 'empty'}</strong>
      </div>

      <div className="spread">
        <span>X</span>
        <strong className="text-strong">{chartConfig.encoding.x?.name ?? 'empty'}</strong>
      </div>

      <div className="spread">
        <span>Y</span>
        <strong className="text-strong">{chartConfig.encoding.y?.name ?? 'empty'}</strong>
      </div>
      <div className="spread">
        <span>Aggregation</span>
        <strong className="text-strong">{chartConfig.aggregate ?? "none"}</strong>
      </div>
    </div>
  )
}

export default SettingsSummary
