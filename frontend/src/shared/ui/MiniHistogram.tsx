import { formatNumber } from '../format/formatNumber'

import type { HistogramBar } from '../../types/ui'

type MiniHistogramProps = {
  bars: HistogramBar[]
  label: string
}

function MiniHistogram({ bars, label }: MiniHistogramProps) {
  const maxCount = Math.max(0, ...bars.map((bar) => bar.count))

  return (
    <div className="mini-histogram" role="img" aria-label={label}>
      {bars.map((bar, index) => (
        <span
          className="mini-histogram-column"
          title={`${bar.label}: ${formatNumber(bar.count)}`}
          key={index}
        >
          <span
            className={`mini-histogram-bar ${bar.isMuted ? 'is-muted' : ''}`}
            style={{
              height: `${maxCount > 0 ? (bar.count / maxCount) * 100 : 0}%`,
            }}
          />
        </span>
      ))}
    </div>
  )
}

export default MiniHistogram
