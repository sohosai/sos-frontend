import { useState, FC } from "react"

import { DropzoneOptions, useDropzone } from "react-dropzone"
import { UseFormRegisterReturn } from "react-hook-form"

import { dataset } from "src/utils/dataset"

import styles from "./index.module.scss"

declare namespace Dropzone {
  type Props = {
    label?: string
    descriptions?: string[]
    errors?: Array<string | false | undefined>
    register?: UseFormRegisterReturn
    dropzoneOptions?: DropzoneOptions
  }
}

const Dropzone: FC<Dropzone.Props> = ({
  label,
  register,
  descriptions,
  errors,
  dropzoneOptions,
}) => {
  const normalizedErrors = errors?.filter((text): text is string =>
    Boolean(text)
  )

  const [dropping, setDropping] = useState(false)

  const { getRootProps, getInputProps } = useDropzone({
    ...dropzoneOptions,
    onDragEnter: (e) => {
      if (dropzoneOptions?.onDragEnter) dropzoneOptions.onDragEnter(e)
      setDropping(true)
    },
    onDragLeave: (e) => {
      if (dropzoneOptions?.onDragLeave) dropzoneOptions.onDragLeave(e)
      setDropping(false)
    },
    onDrop: (...p) => {
      if (dropzoneOptions?.onDrop) dropzoneOptions.onDrop(...p)
      setDropping(false)
    },
  })

  return (
    <div className={styles.wrapper}>
      {label && <p className={styles.label}>{label}</p>}
      <div
        className={styles.dropzoneWrapper}
        {...getRootProps()}
        {...dataset({ dropping, error: Boolean(normalizedErrors?.length) })}
      >
        <span className={`jam-icons jam-upload ${styles.uploadIcon}`} />
        {dropzoneOptions?.multiple && (
          <p className={styles.isMultipleTag}>複数ファイル</p>
        )}
        <p className={styles.message}>
          ファイルをドラッグアンドドロップするか、クリックしてファイルを選択できます
        </p>
        <input {...getInputProps()} {...register} />
      </div>
      {(Boolean(descriptions?.length) || Boolean(normalizedErrors?.length)) && (
        <div className={styles.bottomTextWrapper}>
          {descriptions?.map((text) => (
            <p className={styles.description} key={text}>
              {text}
            </p>
          ))}
          {normalizedErrors?.map((text) => (
            <p className={styles.error} key={text}>
              {text}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export { Dropzone }
