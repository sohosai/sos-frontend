import { Story } from "@storybook/react"

import { Spinner } from "."

export default {
  title: Spinner.name,
  component: Spinner,
}

export const Index: Story<Spinner.Props> = ({ color, radius, lineWidth }) => {
  return <Spinner {...{ color, radius, lineWidth }} />
}

Index.argTypes = {
  color: {
    control: { type: "color" },
    defaultValue: "#000",
  },
  radius: {
    control: { type: "range", min: 10, max: 50 },
    defaultValue: 28,
  },
  lineWidth: {
    control: { type: "range", min: 1, max: 5 },
    defaultValue: 2,
  },
}
