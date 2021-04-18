import { FC, TextareaHTMLAttributes } from "react"

import { dataset } from "../../utils/dataset"

import styles from "./index.module.scss"

declare namespace Textarea {
  type Props = Readonly<{
    label: string
    name?: string
    required?: boolean
    placeholder?: string
    rows?: number
    cols?: number
    description?: string[] | string
    error?: Array<string | false | undefined> | string | false
    // TODO: JSX.IntrinsicElements["textarea"]に変えて廃止
    textareaRestAttributes?: TextareaHTMLAttributes<HTMLTextAreaElement>
  }> &
    JSX.IntrinsicElements["textarea"]
}

const Textarea: FC<Textarea.Props> = ({
  label,
  name,
  required = false,
  placeholder,
  rows = 3,
  cols,
  description,
  error,
  textareaRestAttributes,
  ...restAttributes
}) => {
  const descriptions = (Array.isArray(description)
    ? description
    : [description]
  ).filter((text) => text)
  const errors = (Array.isArray(error)
    ? error
    : [error]
  ).filter((text): text is string => Boolean(text))

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>
        {label}
        {!required && <span className={styles.arbitrary}>(任意)</span>}
      </label>
      <textarea
        name={name}
        className={styles.textarea}
        required={required}
        placeholder={placeholder}
        {...{ rows, cols }}
        {...textareaRestAttributes}
        {...restAttributes}
        {...dataset({ error: Boolean(errors?.length) })}
      />
      {Boolean(descriptions?.length + errors?.length) && (
        <div className={styles.bottomText}>
          {descriptions.map((text, index) => (
            <p className={styles.description} key={index}>
              {text}
            </p>
          ))}
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
