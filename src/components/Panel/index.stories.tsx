import { ArgTypes, Story } from "@storybook/react"

import { Spinner } from "../"
import { Panel } from "."

export default {
  title: Panel.name,
  component: Panel,
}

const argTypes: ArgTypes = {
  style: {
    control: false,
  },
  hoverStyle: {
    defaultValue: "none",
  },
}

export const Text: Story = ({ hoverStyle }) => (
  <Panel
    style={{
      width: "320px",
    }}
    hoverStyle={hoverStyle}
  >
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at nulla
      nec erat suscipit accumsan vel ac dui.
    </p>
  </Panel>
)
Text.argTypes = argTypes

export const Loading: Story = ({ hoverStyle }) => (
  <Panel
    style={{
      minWidth: "320px",
      minHeight: "200px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    hoverStyle={hoverStyle}
  >
    <Spinner />
  </Panel>
)
Loading.argTypes = argTypes
