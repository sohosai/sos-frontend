import { FC } from "react"

import { dataset } from "../../utils/dataset"

import styles from "./index.module.scss"

declare namespace Checkbox {
  type Props = Readonly<{
    checked: boolean
    label?: string
  }> &
    JSX.IntrinsicElements["input"]
}

const Checkbox: FC<Checkbox.Props> = ({
  checked,
  label,
  ...inputRestAttributes
}) => {
  return (
    <div className={styles.wrapper} {...dataset({ checked: checked })}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        {...inputRestAttributes}
      />
      <label className={styles.label}>{label}</label>
      <i className={`jam-icon jam-check ${styles.icon}`} aria-hidden="true" />
    </div>
  )
}

export { Checkbox }
