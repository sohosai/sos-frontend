import type { CheckboxFormItem } from "./checkbox"
import type { FileFormItem } from "./file"
import type { FormItemCondition } from "./formItemCondition"
import type { GridRadioFormItem } from "./gridRadio"
import type { IntegerFormItem } from "./integer"
import type { RadioFormItem } from "./radio"
import type { TextFormItem } from "./text"

export type FormItemId = string

export type FormItem = Readonly<{
  id: FormItemId
  name: string
  description: string
  conditions: FormItemCondition[] | null
}> &
  (
    | CheckboxFormItem
    | FileFormItem
    | GridRadioFormItem
    | IntegerFormItem
    | RadioFormItem
    | TextFormItem
  )
