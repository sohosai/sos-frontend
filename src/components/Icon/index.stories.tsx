import { Story } from "@storybook/react"

import { Icon } from "."

export default {
  title: Icon.name,
  component: Icon,
}

export const Index: Story<Icon.Props> = (props) => <Icon {...props} />

Index.argTypes = {
  icon: {
    defaultValue: "search",
  },
}
