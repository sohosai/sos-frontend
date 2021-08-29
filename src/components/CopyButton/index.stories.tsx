import { Story } from "@storybook/react"
import { CopyButton } from "."

export default {
  title: CopyButton.name,
  component: CopyButton,
}

export const Index: Story<Pick<CopyButton.Props, "string" | "tooltipText">> = (
  props
) => (
  <CopyButton
    {...props}
    onCopied={() => {
      window.alert("Copied!")
    }}
  />
)
Index.argTypes = {
  string: {
    control: {
      type: "text",
    },
    defaultValue: "This is the text to be copied",
  },
  size: {
    defaultValue: "default",
  },
  tooltipText: {
    control: {
      type: "text",
    },
    defaultValue: "クリップボードにコピー",
  },
}
