import { Story } from "@storybook/react"

import { Textarea } from "."

export default {
  title: Textarea.name,
  component: Textarea,
}

export const Index: Story<
  Omit<Textarea.Props, "description"> & { description: string }
> = (options) => (
  <div style={{ width: "320px" }}>
    <Textarea
      {...options}
      description={
        options.description ? options.description.split(",") : undefined
      }
    />
  </div>
)

Index.argTypes = {
  label: {
    defaultValue: "感想など",
  },
  rows: {
    control: { type: "range", min: 1, max: 5 },
    defaultValue: 3,
  },
  description: {
    control: { type: "text" },
    defaultValue: "感想を記入してください",
  },
  error: {
    control: { type: "text" },
    defaultValue: "",
  },
  register: {
    control: false,
  },
}
