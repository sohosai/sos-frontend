import { FC } from "react"

import { useDropzone } from "react-dropzone"

declare namespace FileInput {
  type Props = {
    label?: string
    multiple?: boolean
  }
}

const FileInput: FC<FileInput.Props> = ({ label, multiple = false }) => {
  const { getRootProps, getInputProps } = useDropzone()

  return <></>
}

export { FileInput }
