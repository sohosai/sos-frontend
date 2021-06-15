import { FC } from "react"

import { dataset } from "src/utils/dataset"

import { Icon, Tooltip } from "src/components"

import styles from "./index.module.scss"

declare namespace FileList {
  type Props = {
    files: File[]
    errorThresholdInByte?: number
    errorMessage?: string
  }
}

const formatBytes = (bytes: number, decimals?: number): string => {
  if (bytes == 0) return "0 Bytes"
  const k = 1000,
    dm = decimals || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

const FileList: FC<FileList.Props> = ({
  files,
  errorThresholdInByte = 0,
  errorMessage = "アップロードに失敗した可能性があります",
}) => {
  return (
    <ul className={styles.list}>
      {files.length ? (
        <>
          {files.map((file) => {
            const isError = file.size <= errorThresholdInByte
            return (
              <Tooltip title={isError ? errorMessage : ""} key={file.name}>
                <li
                  className={styles.fileWrapper}
                  {...dataset({
                    error: isError,
                  })}
                >
                  <Icon
                    icon={isError ? "triangle-danger" : "file"}
                    className={styles.icon}
                  />
                  <p className={styles.filename}>{file.name}</p>
                  <p className={styles.fileSize}>{formatBytes(file.size)}</p>
                </li>
              </Tooltip>
            )
          })}
        </>
      ) : (
        <div className={styles.empty}>
          <p>ファイルがありません</p>
        </div>
      )}
    </ul>
  )
}

export { FileList }
