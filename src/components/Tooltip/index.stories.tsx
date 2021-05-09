import type { Story } from "@storybook/react"

import { Tooltip } from "."
import { IconButton as IconButtonComponent } from "src/components"

export default {
  title: Tooltip.name,
  component: Tooltip,
}

export const IconButton: Story = () => (
  <Tooltip title="クリップボードにコピー">
    <div>
      <IconButtonComponent icon="clipboard" />
    </div>
  </Tooltip>
)

export const Text: Story = () => (
  <Tooltip title="吾輩は猫である。名前はまだ無い。">
    <p>吾輩は猫で…</p>
  </Tooltip>
)
