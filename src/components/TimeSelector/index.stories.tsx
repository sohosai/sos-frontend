import { Story } from "@storybook/react"

import { TimeSelector } from "."

export default {
  title: TimeSelector.name,
  component: TimeSelector,
}

export const Index: Story<TimeSelector.Props> = ({ label }) => (
  <TimeSelector label={label} />
)

Index.argTypes = {
  label: {
    defaultValue: "受付開始時間",
  },
  dropdownProps: {
    control: false,
  },
  register: {
    control: false,
  },
  registerOptions: {
    control: false,
  },
  errorTypes: {
    control: false,
  },
}
