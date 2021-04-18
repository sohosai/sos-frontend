import { FC, SelectHTMLAttributes } from "react"

import { dataset } from "../../utils/dataset"

import styles from "./index.module.scss"

declare namespace Dropdown {
  type Props = Readonly<{
    label: string
    name?: string
    required?: boolean
    options: Array<{
      value: string
      label: string
    }>
    description?: string[] | string
    error?: Array<string | false | undefined> | string | false
    selectRestAttributes?: SelectHTMLAttributes<HTMLSelectElement>
  }> &
    JSX.IntrinsicElements["select"]
}

const Dropdown: FC<Dropdown.Props> = ({
  label,
  name,
  required = false,
  options,
  description,
  error,
  selectRestAttributes,
  ...rest
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
      <select
        {...{ name, required }}
        className={styles.select}
        {...dataset({ error: Boolean(errors.length) })}
        {...selectRestAttributes}
        {...rest}
      >
        {options.map(({ value, label }, index) => (
          <option value={value} key={index}>
            {label}
          </option>
        ))}
      </select>
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

export { Dropdown }
