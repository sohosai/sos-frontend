import { Story } from "@storybook/react"

import { Checkbox } from "."

export default {
  title: Checkbox.name,
  component: Checkbox,
}

export const Index: Story<Checkbox.Props> = (options) => (
  <Checkbox {...options} />
)

Index.argTypes = {
  label: {
    control: { type: "text" },
    defaultValue: "有効化する",
  },
}
