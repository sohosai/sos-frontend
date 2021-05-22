import { Story } from "@storybook/react"

import { Stepper } from "."
import { Button } from "src/components"

export default {
  title: Stepper.name,
  component: Stepper,
}

export const Index: Story = () => (
  <Stepper>
    <Stepper.Step title="登録申請に回答する" index={1} active={false} />
    <Stepper.Divider />
    <Stepper.Step title="副責任者を登録する" index={2} active={true} />
    <Stepper.StepContent>
      <Button icon="arrow-right">副責任者の登録へ</Button>
    </Stepper.StepContent>
    <Stepper.Divider />
    <Stepper.Step title="企画応募完了" index={3} active={false} />
  </Stepper>
)
