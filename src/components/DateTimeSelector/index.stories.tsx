import { Story } from "@storybook/react"

import { DateTimeSelector } from "."

export default {
  title: DateTimeSelector.name,
  component: DateTimeSelector,
}

export const Index: Story<DateTimeSelector.Props> = ({ label }) => (
  <DateTimeSelector label={label} />
)

Index.argTypes = {
  label: {
    defaultValue: "受付開始日時",
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
  dropdownProps: {
    control: false,
  },
}
