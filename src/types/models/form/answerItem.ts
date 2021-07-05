import type { CheckboxId } from "./item/checkbox"
import type { RadioId } from "./item/radio"
import type { GridRadioRowId, GridRadioColumnId } from "./item/gridRadio"
import type { FormItemId } from "./item"
import { FileSharingId } from "../files"

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

export type CheckboxFormAnswerItemInForm = Readonly<{
  type: "checkbox"
  answer: {
    [id in CheckboxId]: boolean
  }
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
  answer: FileSharingId[]
}>

export type FileFormAnswerItemInForm = {
  readonly type: "file"
  answer: Array<{
    file_id: string
  }>
}

export type FileFormAnswerItemInFormWithRealFiles = Readonly<{
  type: "file"
  /**
   * `null`は react-hook-form に `defaultValue` として空配列渡すと消える挙動の workaround.
   * バックに投げる前に空配列にする必要あり.
   */
  answer: File[] | null
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

export type FormAnswerItemInForm = { item_id: FormItemId } & (
  | TextFormAnswerItem
  | IntegerFormAnswerItem
  | CheckboxFormAnswerItemInForm
  | RadioFormAnswerItem
  | GridRadioFormAnswerItem
  | FileFormAnswerItemInForm
  | null
)

export type FormAnswerItemInFormWithRealFiles = { item_id: FormItemId } & (
  | TextFormAnswerItem
  | IntegerFormAnswerItem
  | CheckboxFormAnswerItemInForm
  | RadioFormAnswerItem
  | GridRadioFormAnswerItem
  | FileFormAnswerItemInFormWithRealFiles
  | null
)
