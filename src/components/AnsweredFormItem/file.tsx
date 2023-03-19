import { ReactElement } from "react"

import styles from "./file.module.scss"
import { FileList, Paragraph } from "src/components"
import { FormItem } from "src/types/models/form/item"

type Props = {
  formItem: Extract<FormItem, { type: "file" }>
  files: File[]
}

const AnsweredFileFormItem = function ({
  formItem,
  files,
}: Props): ReactElement {
  return (
    <>
      <div className={styles.topText}>
        <p className={styles.name}>
          {formItem.name}
          {!formItem.is_required && (
            <span className={styles.arbitrary}>(任意)</span>
          )}
        </p>
        {formItem.description && Boolean(formItem.description?.length) && (
          <div className={styles.description}>
            <Paragraph text={formItem.description} />
          </div>
        )}
      </div>
      <FileList files={files} />
    </>
  )
}

export { AnsweredFileFormItem }
