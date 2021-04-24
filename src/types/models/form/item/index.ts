import type { CheckboxFormItem } from "./checkbox"
import type { FileFormItem } from "./file"
import type { GridRadioFormItem } from "./gridRadio"
import type { IntegerFormItem } from "./integer"
import type { RadioFormItem } from "./radio"
import type { TextFormItem } from "./text"
import type { FormItemCondition } from "./formItemCondition"

export type FormItemId = string

export type FormItem = Readonly<{
  id: FormItemId
  name: string
  description: string
  conditions?: FormItemCondition[]
}> &
  (
    | CheckboxFormItem
    | FileFormItem
    | GridRadioFormItem
    | IntegerFormItem
    | RadioFormItem
    | TextFormItem
  )
