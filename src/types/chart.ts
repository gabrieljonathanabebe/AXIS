export type DataType = 'date' | 'number' | 'category'

export type DataField = {
  name: string
  type: DataType
}

export type DataValue = string | number | null

export type DataRow = Record<string, DataValue>

export type Dataset = {
  fields: DataField[]
  rows: DataRow[]
}

export type ChartType = 'scatter' | 'line' | 'bar'

export type Aggregation = 'none' | 'sum' | 'mean' | 'median' | 'min' | 'max' | 'count'

export type ChartEncoding = {
  x?: DataField
  y?: DataField
}

export type ChartConfig = {
  type?: ChartType
  encoding: ChartEncoding
  aggregate?: Aggregation
}