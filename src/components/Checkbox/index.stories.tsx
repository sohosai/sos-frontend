import { useState, useEffect } from "react"

import { Story } from "@storybook/react"

import { Checkbox } from "."

export default {
  title: Checkbox.name,
  component: Checkbox,
}

export const Index: Story<
  Omit<Checkbox.Props, "formItemTitle" | "descriptions" | "errors"> & {
    formItemTitle: string
    descriptions: string
    errors: string
  }
> = (options) => {
  const [checked, setChecked] = useState(options.checked)

  useEffect(() => {
    setChecked(options.checked)
  }, [options.checked])

  return (
    <Checkbox
      {...options}
      checked={checked}
      formItemTitle={
        options.formItemTitle?.length
          ? options.formItemTitle.split(",")
          : undefined
      }
      descriptions={
        options.descriptions?.length
          ? options.descriptions.split(",")
          : undefined
      }
      errors={options.errors?.length ? options.errors.split(",") : undefined}
      onChange={(e) => {
        setChecked(e.target.checked)
      }}
    />
  )
}

Index.argTypes = {
  label: {
    control: { type: "text" },
    defaultValue: "有効化する",
  },
  formItemTitle: {
    control: { type: "text" },
  },
  descriptions: {
    control: { type: "text" },
  },
  errors: {
    control: { type: "text" },
  },
  register: {
    control: null,
  },
}
