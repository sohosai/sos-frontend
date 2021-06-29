import { Story } from "@storybook/react"

import { FileList, FileLikeEntity } from "."

export default {
  title: FileList.name,
  component: FileList,
}

const getDummyFile = ({
  sizeInByte,
  filename,
  mime,
}: {
  sizeInByte: number
  filename: string
  mime: string
}) =>
  new File([new Blob([Array(sizeInByte).fill("a").join("")])], filename, {
    type: mime,
  })

const sampleFiles: FileLikeEntity[] = [
  getDummyFile({
    sizeInByte: 5227859,
    filename: "募集要項.pdf",
    mime: "application/pdf",
  }),
  { error: true },
  getDummyFile({
    sizeInByte: 510758,
    filename: "aa11de89-1c70-444e-a1a1-68ff7ab62cbc.jpg",
    mime: "image/jpeg",
  }),
  getDummyFile({
    sizeInByte: 0,
    filename: "2021-06-14-recording.mp3",
    mime: "audio/mpeg",
  }),
  getDummyFile({
    sizeInByte: 21460459,
    filename: "files.zip",
    mime: "application/zip",
  }),
  { error: true, filename: "5344bacf-92dd-4a60.png" },
]

export const Index: Story<
  Omit<FileList.Props, "files"> & { fileCount: number }
> = ({ fileCount, ...rest }) => (
  <div
    style={{
      width: "500px",
    }}
  >
    <FileList files={sampleFiles.slice(0, fileCount)} {...rest} />
  </div>
)

Index.argTypes = {
  files: {
    control: false,
  },
  fileCount: {
    control: {
      type: "range",
      min: 0,
      max: sampleFiles.length,
    },
    defaultValue: sampleFiles.length,
  },
}
