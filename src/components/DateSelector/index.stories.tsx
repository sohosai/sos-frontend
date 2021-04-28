import { Story } from "@storybook/react"

import { DateSelector } from "."

export default {
  title: DateSelector.name,
  component: DateSelector,
}

export const Index: Story<DateSelector.Props> = ({ label }) => (
  <DateSelector label={label} />
)

Index.argTypes = {
  label: {
    defaultValue: "受付開始日",
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
