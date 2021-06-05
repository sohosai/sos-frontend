import { FC } from "react"

import { UseFormRegisterReturn } from "react-hook-form"

import { dataset } from "../../utils/dataset"

import { ParagraphWithUrlParsing } from "../"

import styles from "./index.module.scss"

declare namespace Checkbox {
  type Props = Readonly<{
    checked: boolean
    label?: string
    formItemTitle?: string[]
    formItemTitleUrlParsing?: boolean
    descriptions?: string[]
    descriptionsUrlParsing?: boolean
    errors?: Array<string | false | undefined>
    register?: UseFormRegisterReturn
  }> &
    JSX.IntrinsicElements["input"]
}

const Checkbox: FC<Checkbox.Props> = ({
  checked,
  label,
  formItemTitle,
  formItemTitleUrlParsing = false,
  descriptions,
  descriptionsUrlParsing = false,
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
      {formItemTitle && Boolean(formItemTitle?.length) && (
        <div className={styles.titleWrapper}>
          {formItemTitleUrlParsing ? (
            <ParagraphWithUrlParsing
              text={formItemTitle}
              normalTextClassName={styles.title}
            />
          ) : (
            <>
              {formItemTitle?.map((text) => (
                <p className={styles.title} key={text}>
                  {text}
                </p>
              ))}
            </>
          )}
        </div>
      )}
      {descriptions && Boolean(descriptions?.length) && (
        <div className={styles.descriptionsWrapper}>
          {descriptionsUrlParsing ? (
            <ParagraphWithUrlParsing
              text={descriptions}
              normalTextClassName={styles.description}
            />
          ) : (
            <>
              {" "}
              {descriptions?.map((text) => (
                <p className={styles.description} key={text}>
                  {text}
                </p>
              ))}
            </>
          )}
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
