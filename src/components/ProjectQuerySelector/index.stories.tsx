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
      general_physical: true,
      general_online: true,
      stage_physical: false,
      stage_online: false,
      cooking_physical: true,
      food_physical: true,
      academic: true,
      artistic: true,
      outdoor: false,
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
