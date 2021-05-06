import { Story } from "@storybook/react"

import { Toast } from "."

export default {
  title: Toast.name,
  component: Toast,
}

export const Index: Story<
  Omit<Toast.Props, "descriptions"> & { descriptions: string }
> = (options) => (
  <Toast
    {...options}
    descriptions={
      options.descriptions.length ? options.descriptions.split(",") : []
    }
    progress={options.progress}
  />
)

Index.argTypes = {
  kind: {
    defaultValue: "info",
  },
  title: {
    defaultValue: "申請に回答しました",
  },
  descriptions: {
    control: { type: "text" },
  },
  progress: {
    control: { type: "range", min: 0, max: 1, step: 0.1 },
    defaultValue: 0.3,
  },
}
