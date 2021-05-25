import { Story } from "@storybook/react"

import { ParagraphWithUrlParsing } from "."

export default {
  title: ParagraphWithUrlParsing.name,
  component: ParagraphWithUrlParsing,
}

export const Index: Story<ParagraphWithUrlParsing.Props> = (options) => (
  <ParagraphWithUrlParsing {...options} />
)
Index.argTypes = {
  text: {
    control: { type: "text" },
    defaultValue:
      "募集要項を公開しました\nhttps://online.sohosai.com/\nご確認ください",
  },
}
