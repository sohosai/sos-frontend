import { Story } from "@storybook/react"

import { Textarea } from "."

export default {
  title: Textarea.name,
  component: Textarea,
}

export const Index: Story<Textarea.Props> = (options) => (
  <div style={{ width: "320px" }}>
    <Textarea {...options} />
  </div>
)

Index.argTypes = {
  label: {
    defaultValue: "感想など",
  },
  rows: {
    control: { type: "range", min: 1, max: 5, default: 3 },
  },
  cols: {
    control: { type: "range", min: 10, max: 30, default: 20, step: 5 },
  },
  description: {
    control: { type: "text" },
    defaultValue: "感想を記入してください",
  },
  error: {
    control: { type: "text" },
    defaultValue: "",
  },
  textareaRestAttributes: {
    control: false,
  },
}
