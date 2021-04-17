import { Story } from "@storybook/react"

import { IconButton } from "."

export default {
  title: IconButton.name,
  component: IconButton,
}

export const Index: Story<IconButton.Props> = (options) => (
  <IconButton {...options} />
)

Index.argTypes = {
  size: {
    defaultValue: "default",
  },
  icon: {
    defaultValue: "paper-plane",
  },
}
