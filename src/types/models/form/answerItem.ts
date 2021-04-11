import type { CheckboxId } from "./item/checkbox"
import type { RadioId } from "./item/radio"
import type { GridRadioRowId, GridRadioColumnId } from "./item/gridRadio"
import type { FormItemId } from "./item"

export type TextFormAnswerItem = Readonly<{
  type: "text"
  answer?: string
}>

export type IntegerFormAnswerItem = Readonly<{
  type: "integer"
  answer?: number
}>

export type CheckboxFormAnswerItem = Readonly<{
  type: "checkbox"
  answer: CheckboxId[]
}>

export type RadioFormAnswerItem = Readonly<{
  type: "radio"
  answer?: RadioId
}>

export type GridRadioFormAnswerItem = Readonly<{
  type: "grid_radio"
  answer: Array<{
    row_id: GridRadioRowId
    value?: GridRadioColumnId
  }>
}>

export type FileFormAnswerItem = Readonly<{
  type: "file"
  // FIXME: FileSharingId
  answer: string[]
}>

export type FormAnswerItem = { item_id: FormItemId } & (
  | TextFormAnswerItem
  | IntegerFormAnswerItem
  | CheckboxFormAnswerItem
  | RadioFormAnswerItem
  | GridRadioFormAnswerItem
  | FileFormAnswerItem
  | null
)
