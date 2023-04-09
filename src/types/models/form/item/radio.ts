export type RadioId = string

export type RadioFormItem = Readonly<{
  type: "radio"
  buttons:
    | Array<{
        id: RadioId
        label: string
      }>
    | string
  is_required: boolean
}>
