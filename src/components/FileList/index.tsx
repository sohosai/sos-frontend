import { FC } from "react"

import { saveAs } from "file-saver"

import { dataset } from "src/utils/dataset"

import { Icon, IconButton, Tooltip } from "src/components"

import styles from "./index.module.scss"

export type FileLikeEntity = File | { error: true; filename?: string }

declare namespace FileList {
  type Props = {
    files: FileLikeEntity[]
    errorThresholdInByte?: number
    fileSizeErrorMessage?: string
    downloadEnabled?: boolean
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

const FileListItem: FC<{
  file: File | { error: true; name?: string }
  downloadEnabled: boolean
  errorMessage?: string
}> = ({ file, errorMessage, downloadEnabled }) => (
  <Tooltip title={errorMessage && file.name ? errorMessage : ""}>
    <div
      className={styles.itemWrapper}
      {...dataset({
        error: Boolean(errorMessage?.length),
      })}
    >
      <Icon
        icon={errorMessage?.length ? "triangle-danger" : "file"}
        className={styles.icon}
      />
      <p className={styles.filename}>{file.name ?? errorMessage}</p>
      {file instanceof File && (
        <>
          <p className={styles.fileSize}>{formatBytes(file.size)}</p>
          {downloadEnabled && (
            <div className={styles.downloadButton}>
              <Tooltip title="ダウンロード">
                <div>
                  <IconButton
                    icon="download"
                    onClick={() => {
                      saveAs(file, file.name)
                    }}
                  />
                </div>
              </Tooltip>
            </div>
          )}
        </>
      )}
    </div>
  </Tooltip>
)

const FileList: FC<FileList.Props> = ({
  files,
  errorThresholdInByte = 0,
  fileSizeErrorMessage = "アップロードに失敗した可能性があります",
  downloadEnabled = true,
}) => {
  return (
    <ul className={styles.list}>
      {files?.length ? (
        <>
          {files.map((file, index) => {
            const fileSizeError =
              !("error" in file) && file.size <= errorThresholdInByte

            return (
              <li
                key={file instanceof File ? file.name + index : index}
                className={styles.fileWrapper}
              >
                {"error" in file ? (
                  <FileListItem
                    file={{ error: true, name: file.filename }}
                    errorMessage={"ファイルの読み込みに失敗しました"}
                    downloadEnabled={false}
                  />
                ) : (
                  <FileListItem
                    file={file}
                    downloadEnabled={downloadEnabled}
                    errorMessage={
                      fileSizeError ? fileSizeErrorMessage : undefined
                    }
                  />
                )}
              </li>
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
