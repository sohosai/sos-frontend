import { FC } from "react"

import type { UseFormRegisterReturn } from "react-hook-form"

import { ParagraphWithUrlParsing } from "../"
import { dataset } from "../../utils/dataset"

import styles from "./index.module.scss"

declare namespace Textarea {
  type Props = Readonly<{
    label?: string
    description?: string[] | string
    descriptionUrlParsing?: boolean
    error?: Array<string | false | undefined> | string | false
    register?: UseFormRegisterReturn
  }> &
    JSX.IntrinsicElements["textarea"]
}

const Textarea: FC<Textarea.Props> = ({
  label,
  required = false,
  placeholder,
  rows = 3,
  description,
  descriptionUrlParsing = false,
  error,
  register,
  ...restAttributes
}) => {
  const descriptions = (
    Array.isArray(description) ? description : [description]
  ).filter((text): text is string => Boolean(text))
  const errors = (Array.isArray(error) ? error : [error]).filter(
    (text): text is string => Boolean(text)
  )

  return (
    <div className={styles.wrapper}>
      {Boolean(label) && (
        <label className={styles.label}>
          {label}
          {!required && <span className={styles.arbitrary}>(任意)</span>}
        </label>
      )}
      <textarea
        className={styles.textarea}
        required={required}
        placeholder={placeholder}
        rows={rows}
        {...register}
        {...restAttributes}
        {...dataset({ error: Boolean(errors?.length) })}
      />
      {Boolean(descriptions?.length + errors?.length) && (
        <div className={styles.bottomText}>
          {descriptionUrlParsing ? (
            <ParagraphWithUrlParsing
              text={descriptions}
              normalTextClassName={styles.description}
            />
          ) : (
            <>
              {descriptions.map((text, index) => (
                <p className={styles.description} key={index}>
                  {text}
                </p>
              ))}
            </>
          )}
          {errors.map((text, index) => (
            <p className={styles.error} key={index}>
              {text}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export { Textarea }
