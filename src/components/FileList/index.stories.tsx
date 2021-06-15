import { Story } from "@storybook/react"

import { FileList } from "."

export default {
  title: FileList.name,
  component: FileList,
}

const sampleFiles: File[] = [
  {
    size: 5227859,
    lastModified: 1623591217446,
    type: "application/pdf",
    name: "募集要項.pdf",
    arrayBuffer: {} as any,
    slice: {} as any,
    stream: {} as any,
    text: {} as any,
  },
  {
    size: 510758,
    lastModified: 1529068320000,
    type: "image/jpeg",
    name: "aa11de89-1c70-444e-a1a1-68ff7ab62cbc.jpg",
    arrayBuffer: {} as any,
    slice: {} as any,
    stream: {} as any,
    text: {} as any,
  },
  {
    size: 0,
    lastModified: 1623741471891,
    type: "audio/mpeg",
    name: "2021-06-14-recording.mp3",
    arrayBuffer: {} as any,
    slice: {} as any,
    stream: {} as any,
    text: {} as any,
  },
  {
    size: 21460459,
    lastModified: 1623601572545,
    type: "application/zip",
    name: "files.zip",
    arrayBuffer: {} as any,
    slice: {} as any,
    stream: {} as any,
    text: {} as any,
  },
]

export const Index: Story<FileList.Props & { fileCount: number }> = ({
  errorThresholdInByte,
  errorMessage,
  fileCount,
}) => (
  <div
    style={{
      width: "320px",
    }}
  >
    <FileList
      files={sampleFiles.slice(0, fileCount)}
      errorThresholdInByte={errorThresholdInByte}
      errorMessage={errorMessage}
    />
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
      max: 4,
    },
    defaultValue: 4,
  },
}
