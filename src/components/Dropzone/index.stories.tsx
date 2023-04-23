import { Story } from "@storybook/react"

import { useForm } from "react-hook-form"

import { Dropzone } from "."

type Inputs = {
  files: FileList
}

export default {
  title: Dropzone.name,
  component: Dropzone,
}

export const Index: Story<
  Omit<
    Dropzone.Props<Inputs>,
    "descriptions" | "errors" | "control" | "name" | "rules"
  > & {
    descriptions: string
    errors: string
  }
> = (options) => {
  const { control } = useForm<Inputs>()

  return (
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
        control={control}
        name="files"
        dropzoneOptions={{
          onDropAccepted: (files) => {
            window.alert(files.map((file) => file.name).join("\n"))
          },
        }}
      />
    </div>
  )
}

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
  dropzoneOptions: {
    control: false,
  },
}
