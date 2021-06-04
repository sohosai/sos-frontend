import { Story } from "@storybook/react"

import { TextField } from "."

export default {
  title: TextField.name,
  component: TextField,
}

export const Index: Story<
  Omit<TextField.Props, "description"> & { description: string }
> = (options) => (
  <div style={{ width: "320px" }}>
    <TextField {...options} description={options.description.split(",")} />
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
  description: {
    control: { type: "text" },
    defaultValue: "筑波大学のメールアドレスを使用してください",
  },
  error: {
    control: { type: "text" },
    defaultValue: "",
  },
  autoComplete: {
    control: { type: "text" },
    defaultValue: "email",
  },
  register: {
    control: false,
  },
}
