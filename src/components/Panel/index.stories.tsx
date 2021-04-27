import { Story } from "@storybook/react"

import { Panel } from "."
import { Spinner } from "../"

export default {
  title: Panel.name,
  component: Panel,
}

export const Text: Story = () => (
  <Panel
    style={{
      width: "320px",
    }}
  >
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at nulla
      nec erat suscipit accumsan vel ac dui.
    </p>
  </Panel>
)

export const Loading: Story = () => (
  <Panel
    style={{
      minWidth: "320px",
      minHeight: "200px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Spinner />
  </Panel>
)
