import type { ChartConfig } from '../types/chart'

type ChartStageProps = {
  chartConfig: ChartConfig
}

function ChartStage({ chartConfig }: ChartStageProps) {
  return (
    <div className="chart-stage">
      <div className="chart-empty-state">
        <p>Drag fields onto chart axes.</p>
      </div>

      <div className="chart-axis x-axis">
        <span>X</span>
        <strong>{chartConfig.encoding.x?.name ?? 'empty'}</strong>
      </div>

      <div className="chart-axis y-axis">
        <span>Y</span>
        <strong>{chartConfig.encoding.y?.name ?? 'empty'}</strong>
      </div>
    </div>
  )
}

export default ChartStage