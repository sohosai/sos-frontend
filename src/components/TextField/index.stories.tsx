import { Story } from "@storybook/react"

import { TextField } from "."

export default {
  title: TextField.name,
  component: TextField,
}

export const Index: Story<TextField.Props> = (options) => (
  <div style={{ width: "320px" }}>
    <TextField {...options} />
  </div>
)

Index.argTypes = {
  type: {
    control: { type: "select" },
    defaultValue: "text",
  },
  label: {
    defaultValue: "メールアドレス",
  },
  name: {
    defaultValue: "email",
  },
  description: {
    control: { type: "text" },
    defaultValue: "筑波大学のメールアドレスを使用してください",
  },
  error: {
    control: { type: "text" },
    defaultValue: "",
  },
  autocomplete: {
    defaultValue: "email",
  },
}
