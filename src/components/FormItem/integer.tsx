import { FC } from "react"

import { UseFormRegisterReturn } from "react-hook-form"

import { FormItem } from "src/types/models/form/item"

import { TextField } from "src/components"

type Props = {
  formItem: Extract<FormItem, { type: "integer" }>
  register: UseFormRegisterReturn
  errors: Array<string | false | undefined>
}

const IntegerFormItem: FC<Props> = ({ formItem, register, errors }) => {
  // TODO: unit
  return (
    <TextField
      type="number"
      label={formItem.name}
      required={formItem.is_required}
      max={formItem.max ?? undefined}
      min={formItem.min ?? undefined}
      placeholder={
        formItem.placeholder ? String(formItem.placeholder) : undefined
      }
      description={formItem.description.split("\n")}
      error={errors}
      register={register}
    />
  )
}

export { IntegerFormItem }
