import { FC } from "react"

import { UseFormRegisterReturn } from "react-hook-form"

import { dataset } from "../../utils/dataset"

import styles from "./index.module.scss"

declare namespace TextField {
  type Props = Readonly<{
    type: "text" | "email" | "password" | "number"
    label?: string
    description?: string[] | string
    error?: Array<string | false | undefined> | string | false
    register?: UseFormRegisterReturn
  }> &
    JSX.IntrinsicElements["input"]
}

const TextField: FC<TextField.Props> = ({
  type,
  label,
  name,
  required = false,
  placeholder,
  description,
  error,
  autoComplete,
  register,
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
      {Boolean(label) && (
        <label className={styles.label}>
          {label}
          {!required && <span className={styles.arbitrary}>(任意)</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        className={styles.input}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        {...register}
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

export { TextField }
