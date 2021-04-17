import { useState, useEffect } from "react"

import { Story } from "@storybook/react"

import { Checkbox } from "."

export default {
  title: Checkbox.name,
  component: Checkbox,
}

export const Index: Story<Checkbox.Props> = (options) => {
  const [checked, setChecked] = useState(options.checked)

  useEffect(() => {
    setChecked(options.checked)
  }, [options.checked])

  return (
    <Checkbox
      {...options}
      checked={checked}
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
}
