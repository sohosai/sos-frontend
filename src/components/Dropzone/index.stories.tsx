import { Story } from "@storybook/react"

import { Dropzone } from "."

export default {
  title: Dropzone.name,
  component: Dropzone,
}

export const Index: Story<
  Omit<Dropzone.Props<any>, "descriptions" | "errors"> & {
    descriptions: string
    errors: string
  }
> = (options) => (
  <div
    style={{
      width: "320px",
    }}
  >
    <Dropzone
      {...options}
      descriptions={
        options.descriptions?.length
          ? options.descriptions.split(",")
          : undefined
      }
      errors={options.errors?.length ? options.errors.split(",") : undefined}
    />
  </div>
)

Index.argTypes = {
  label: {
    defaultValue: "ファイルをアップロード",
  },
  descriptions: {
    control: { type: "text" },
  },
  errors: {
    control: { type: "text" },
  },
  register: {
    control: false,
  },
  dropzoneOptions: {
    control: false,
  },
}
