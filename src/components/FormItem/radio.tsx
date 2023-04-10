import { FC } from "react"

import { UseFormRegisterReturn } from "react-hook-form"

import { Dropdown } from "src/components"
import { FormItem } from "src/types/models/form/item"

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
      ...(typeof formItem.buttons !== "string"
        ? formItem.buttons.map(({ id, label }) => ({
            value: id,
            label,
          }))
        : []),
    ]}
    error={errors}
    required={formItem.is_required}
    register={register}
  />
)
export { RadioFormItem }
