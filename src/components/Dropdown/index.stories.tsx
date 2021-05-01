import { Story } from "@storybook/react"

import { Dropdown } from "."

export default {
  title: Dropdown.name,
  component: Dropdown,
}

export const Index: Story<
  Omit<Dropdown.Props, "options"> & { options: string }
> = (props) => (
  <div style={{ width: "320px" }}>
    <Dropdown
      {...{
        ...props,
        options: props.options
          .split(",")
          .map((str) => ({ value: str, label: str })),
      }}
    />
  </div>
)

Index.argTypes = {
  label: {
    defaultValue: "参加区分",
  },
  name: {
    defaultValue: "category",
  },
  options: {
    control: { type: "text" },
    defaultValue: "一般企画,ステージ企画",
  },
  description: {
    control: { type: "text" },
    defaultValue: "参加区分を選択してください",
  },
  error: {
    control: { type: "text" },
    defaultValue: "",
  },
  register: {
    control: false,
  },
}
