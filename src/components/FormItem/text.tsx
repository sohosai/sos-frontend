import { FC } from "react"

import { UseFormRegisterReturn } from "react-hook-form"

import { FormItem } from "src/types/models/form/item"

import { Textarea, TextField } from "src/components"

type Props = {
  formItem: Extract<FormItem, { type: "text" }>
  register: UseFormRegisterReturn
  errors: Array<string | false | undefined>
}

const TextFormItem: FC<Props> = ({ formItem, register, errors }) => {
  if (formItem.accept_multiple_lines)
    return (
      <Textarea
        label={formItem.name}
        required={formItem.is_required}
        placeholder={formItem.placeholder}
        description={formItem.description.split("\n")}
        descriptionUrlParsing
        error={errors}
        register={register}
      />
    )

  return (
    <TextField
      type="text"
      label={formItem.name}
      required={formItem.is_required}
      placeholder={formItem.placeholder}
      description={formItem.description.split("\n")}
      descriptionUrlParsing
      error={errors}
      register={register}
    />
  )
}

export { TextFormItem }
