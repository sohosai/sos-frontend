import { Story } from "@storybook/react"
import { ProjectAttributeChips } from "."
import { ProjectAttribute } from "src/types/models/project"

export default {
  title: ProjectAttributeChips.name,
  component: ProjectAttributeChips,
}

export const Index: Story<{ [attribute in ProjectAttribute]: boolean }> = ({
  academic,
  artistic,
  outdoor,
  committee,
}) => (
  <ProjectAttributeChips
    attributes={{ academic, artistic, outdoor, committee }}
  />
)
Index.argTypes = {
  academic: {
    control: {
      type: "boolean",
    },
    defaultValue: true,
  },
  artistic: {
    control: {
      type: "boolean",
    },
    defaultValue: false,
  },
  outdoor: {
    control: {
      type: "boolean",
    },
    defaultValue: false,
  },
  committee: {
    control: {
      type: "boolean",
    },
    defaultValue: false,
  },
}
