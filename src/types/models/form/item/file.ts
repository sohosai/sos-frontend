import type { Mime } from "../../files/"

export type FileFormItem = Readonly<{
  type: "file"
  accepted_types: Mime[] | null
  is_required: boolean
  accept_multiple_files: boolean
}>
