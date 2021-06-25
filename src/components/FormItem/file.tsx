import { ReactElement } from "react"

import { FormItem } from "src/types/models/form/item"

import { Dropzone, FileList, ParagraphWithUrlParsing } from "src/components"

import styles from "./file.module.scss"

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
