import { Story } from "@storybook/react"

import { Button } from "."

export default {
  title: Button.name,
  component: Button,
}

export const Index: Story<Button.Props> = (options) => (
  <div
    style={{
      width: "320px",
      display: "flex",
      justifyContent: "center",
    }}
  >
    <Button {...options}>送信する</Button>
  </div>
)
Index.argTypes = {
  kind: {
    defaultValue: "primary",
  },
  size: {
    defaultValue: "default",
  },
  type: {
    defaultValue: "button",
  },
  buttonRestAttributes: {
    control: false,
  },
  icon: {
    defaultValue: "paper-plane",
  },
}
