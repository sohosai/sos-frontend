import { FC } from "react"

import { UseFormRegisterReturn } from "react-hook-form"

import { dataset } from "../../utils/dataset"

import styles from "./index.module.scss"

declare namespace Checkbox {
  type Props = Readonly<{
    checked: boolean
    label?: string
    formItemTitle?: string[]
    descriptions?: string[]
    errors?: Array<string | false | undefined>
    register?: UseFormRegisterReturn
  }> &
    JSX.IntrinsicElements["input"]
}

const Checkbox: FC<Checkbox.Props> = ({
  checked,
  label,
  formItemTitle,
  descriptions,
  errors,
  register,
  ...inputRestAttributes
}) => {
  const normalizedErrors = errors?.filter((text): text is string =>
    Boolean(text)
  )

  return (
    <div
      className={styles.wrapper}
      {...dataset({ checked, error: Boolean(normalizedErrors?.length) })}
    >
      {Boolean(formItemTitle?.length) && (
        <div className={styles.titleWrapper}>
          {formItemTitle?.map((text) => (
            <p className={styles.title} key={text}>
              {text}
            </p>
          ))}
        </div>
      )}
      {Boolean(descriptions?.length) && (
        <div className={styles.descriptionsWrapper}>
          {descriptions?.map((text) => (
            <p className={styles.description} key={text}>
              {text}
            </p>
          ))}
        </div>
      )}
      <div className={styles.checkboxWrapper}>
        <label className={styles.label}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={checked}
            {...register}
            {...inputRestAttributes}
          />
          {label}
          <i
            className={`jam-icons jam-check ${styles.icon}`}
            aria-hidden="true"
          />
        </label>
      </div>
      {Boolean(normalizedErrors?.length) && (
        <div className={styles.errorsWrapper}>
          {normalizedErrors?.map((text) => (
            <p className={styles.error} key={text}>
              {text}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export { Checkbox }
