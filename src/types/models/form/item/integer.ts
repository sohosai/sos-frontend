export type IntegerFormItem = Readonly<{
  type: "integer"
  is_required: boolean
  max?: number
  min?: number
  placeholder: number
  unit?: string
}>
