export type TextFormItem = Readonly<{
  type: "text"
  accept_multiple_lines: boolean
  is_required: boolean
  max_length?: number
  min_length?: number
  placeholder: string
}>
