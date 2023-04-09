export type CheckboxId = string

export type CheckboxFormItem = Readonly<{
  type: "checkbox"
  boxes:
    | Array<{
        id: CheckboxId
        label: string
      }>
    | string
  min_checks?: number
  max_checks?: number
}>
