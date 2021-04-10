import { Story } from "@storybook/react"

import { Button } from "."

export default {
  title: Button.name,
  component: Button,
}

export const Index: Story<Button.Props> = (options) => (
  <Button {...options}>送信する</Button>
)
Index.argTypes = {
  buttonRestAttributes: {
    control: false,
  },
  icon: {
    defaultValue: "paper-plane",
  },
}
