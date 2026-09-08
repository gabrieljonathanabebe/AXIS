export type DataType = 'date' | 'number' | 'category'

export type DataField = {
  name: string
  type: DataType
}

export type ChartType = 'scatter' | 'line' | 'bar'

export type ChartEncoding = {
  x?: DataField
  y?: DataField
}

export type ChartConfig = {
  type?: ChartType
  encoding: ChartEncoding
}