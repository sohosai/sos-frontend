import { FC } from "react"

import { Dropdown } from "src/components"
import { FormItem } from "src/types/models/form/item"
import { RadioId } from "src/types/models/form/item/radio"

type Props = {
  formItem: Extract<FormItem, { type: "radio" }>
  selectedAnswer:
    | {
        id: RadioId
        label: string
      }
    | undefined
}

const AnsweredRadioFormItem: FC<Props> = ({ formItem, selectedAnswer }) => {
  const options = selectedAnswer
    ? [
        {
          value: selectedAnswer.id,
          label: selectedAnswer.label,
        },
      ]
    : [
        {
          value: "",
          label: "未選択",
        },
      ]
  return (
    <Dropdown
      label={formItem.name}
      description={formItem.description.split("\n")}
      descriptionUrlParsing
      options={options}
      required={formItem.is_required}
    />
  )
}
export { AnsweredRadioFormItem }
