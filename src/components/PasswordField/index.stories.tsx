import { Story } from "@storybook/react"

import { PasswordField } from "."

export default {
  title: PasswordField.name,
  component: PasswordField,
}

export const Index: Story<PasswordField.Props> = (options) => (
  <div style={{ width: "320px" }}>
    <PasswordField {...options} />
  </div>
)

Index.argTypes = {
  label: {
    defaultValue: "パスワード",
  },
  name: {
    defaultValue: "password",
  },
  description: {
    control: { type: "text" },
    defaultValue: "",
  },
  error: {
    control: { type: "text" },
    defaultValue: "",
  },
  autocomplete: {
    defaultValue: "new-password",
  },
}
