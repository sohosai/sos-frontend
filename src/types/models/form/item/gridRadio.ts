export type GridRadioRowId = string
export type GridRadioColumnId = string

export type GridRadioFormItem = Readonly<{
  type: "grid_radio"
  rows: Array<{
    id: GridRadioRowId
    label: string
  }>
  columns: Array<{
    id: GridRadioColumnId
    label: string
  }>
  exclusive_column: boolean
  required: "all" | "none"
}>
