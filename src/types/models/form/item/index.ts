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

// フォームエディターのUIの都合で FormItem とは違ったインターフェースを
// 受け入れる必要があるものに対応
export type FormItemInFormEditor = Readonly<{
  id: FormItemId
  name: string
  description: string
  conditions?: FormItemCondition[]
}> &
  (
    | (Omit<CheckboxFormItem, "boxes" | "min_checks" | "max_checks"> & {
        boxes: string
        min_checks: string
        max_checks: string
      })
    // | FileFormItem
    // | GridRadioFormItem
    // | IntegerFormItem
    // | RadioFormItem
    | (Omit<TextFormItem, "min_length" | "max_length"> & {
        min_length: string
        max_length: string
      })
  )
