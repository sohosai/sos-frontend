import { FC } from "react"

import { dataset } from "../../utils/dataset"

import type { Register } from "../../types/form"

import styles from "./index.module.scss"

declare namespace TextField {
  type Props = Readonly<{
    label: string
    name: string
    required?: boolean
    description?: string[] | string
    error?: string[] | string
    autocomplete?: string
    register?: Register
  }>
}

const TextField: FC<TextField.Props> = ({
  label,
  name,
  required = false,
  description,
  error,
  autocomplete,
  register,
}) => {
  const descriptions = (Array.isArray(description)
    ? description
    : [description]
  ).filter((text) => text)
  const errors = (Array.isArray(error) ? error : [error]).filter((text) => text)

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>
        {label}
        {!required && <span className={styles.arbitrary}>(任意)</span>}
      </label>
      <input
        type="text"
        name={name}
        className={styles.input}
        autoComplete={autocomplete}
        ref={register}
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
