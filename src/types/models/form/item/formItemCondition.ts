import type { FormItemId } from "."
import type { CheckboxId } from "./checkbox"
import type { RadioId } from "./radio"
import type { GridRadioColumnId } from "./gridRadio"

export type FormItemCondition =
  | Readonly<{
      type: "checkbox"
      item_id: FormItemId
      checkbox_id: CheckboxId
      expected: boolean
    }>
  | Readonly<{
      type: "radio_selected"
      item_id: FormItemId
      radio_id: RadioId
    }>
  | Readonly<{
      type: "grid_radio_selected"
      item_id: FormItemId
      column_id: GridRadioColumnId
    }>
