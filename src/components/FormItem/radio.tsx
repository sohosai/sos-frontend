import { FC } from "react"

import { UseFormRegisterReturn } from "react-hook-form"

import { FormItem } from "src/types/models/form/item"

import { Dropdown } from "src/components"

type Props = {
  formItem: Extract<FormItem, { type: "radio" }>
  register: UseFormRegisterReturn
  errors: Array<string | false | undefined>
}

const RadioFormItem: FC<Props> = ({ formItem, register, errors }) => (
  <Dropdown
    label={formItem.name}
    description={formItem.description.split("\n")}
    descriptionUrlParsing
    options={[
      {
        value: "",
        label: "選択してください",
      },
      ...formItem.buttons.map(({ id, label }) => ({
        value: id,
        label,
      })),
    ]}
    error={errors}
    required={formItem.is_required}
    register={register}
  />
)
export { RadioFormItem }
