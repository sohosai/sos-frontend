export type IntegerFormItem = Readonly<{
  type: "integer"
  is_required: boolean
  max: number | null
  min: number | null
  placeholder: number | null
  unit: string | null
}>
