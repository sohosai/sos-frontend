import { ReactElement } from "react"

import styles from "./file.module.scss"
import { Dropzone, FileList, ParagraphWithUrlParsing } from "src/components"
import { FormItem } from "src/types/models/form/item"

type Props<T> = {
  formItem: Extract<FormItem, { type: "file" }>
  files: File[]
} & Pick<Dropzone.Props<T>, "control" | "name" | "errors">

const FileFormItem = function <T>({
  formItem,
  control,
  name,
  errors,
  files,
}: Props<T>): ReactElement {
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
            <ParagraphWithUrlParsing text={formItem.description} />
          </div>
        )}
      </div>
      <div className={styles.dropZone}>
        <Dropzone
          control={control}
          name={name}
          errors={errors}
          multiple={formItem.accept_multiple_files}
          rules={{
            required: formItem.is_required,
          }}
          dropzoneOptions={{
            accept: formItem.accepted_types ?? undefined,
          }}
        />
      </div>
      <div className={styles.files}>
        <FileList files={files} />
      </div>
    </>
  )
}

export { FileFormItem }
