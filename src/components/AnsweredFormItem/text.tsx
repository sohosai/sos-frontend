import { FC } from "react"

import { Textarea, TextField } from "src/components"
import { FormItem } from "src/types/models/form/item"

type Props = {
  formItem: Extract<FormItem, { type: "text" }>
  answer: string | undefined
}

const AnsweredTextFormItem: FC<Props> = ({ formItem, answer }) => {
  if (formItem.accept_multiple_lines)
    return (
      <Textarea
        label={formItem.name}
        required={formItem.is_required}
        placeholder={formItem.placeholder}
        description={formItem.description.split("\n")}
        descriptionUrlParsing
        defaultValue={answer}
        readOnly
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
      defaultValue={answer}
      readOnly
    />
  )
}

export { AnsweredTextFormItem }
