import { Story } from "@storybook/react"

import { ProjectQuerySelector } from "."

export default {
  title: ProjectQuerySelector.name,
  component: ProjectQuerySelector,
}

export const Index: Story<ProjectQuerySelector.Props> = (options) => (
  <ProjectQuerySelector
    {...options}
    checked={{
      general: true,
      stage: false,
      cooking_requiring_preparation_area: true,
      cooking: true,
      food: true,
      academic: true,
      artistic: true,
      outdoor: true,
      indoor: true,
      committee: false,
    }}
  />
)

Index.argTypes = {
  checked: {
    control: false,
  },
  registers: {
    control: false,
  },
}

export {}
