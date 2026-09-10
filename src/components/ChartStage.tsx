import type { ChartConfig, Dataset } from '../types/chart'
import EChartCanvas from './EChartCanvas'

type ChartStageProps = {
  chartConfig: ChartConfig
  dataset: Dataset
}

function ChartStage({ chartConfig, dataset }: ChartStageProps) {
  return (
    <div className="chart-stage">
      <EChartCanvas chartConfig={chartConfig} dataset={dataset} />
    </div>
  )
}

export default ChartStage
