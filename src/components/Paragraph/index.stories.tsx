import { Story } from "@storybook/react"

import { Paragraph } from "."

export default {
  title: Paragraph.name,
  component: Paragraph,
}

export const Index: Story<Paragraph.Props> = (options) => (
  <Paragraph {...options} />
)
Index.argTypes = {
  text: {
    control: { type: "text" },
    defaultValue:
      "募集要項を公開しました\nhttps://online.sohosai.com/\nご確認ください",
  },
  parseUrl: {
    defaultValue: true,
  },
}
